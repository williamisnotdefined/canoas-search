import { load, Element, CheerioAPI, Cheerio } from "cheerio";
import { remove as removeDiacritics } from "diacritics";
import fetch from "node-fetch";

const DRIVE_URL =
  "https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#";

type Data = { [x: string]: string }[][];

const getTableHead = (
  $: CheerioAPI,
  tableRows: Cheerio<Element>,
  index: number
) => {
  return $(tableRows[1])
    .find("td")
    .toArray()
    .map((cell) => $(cell).text())[index];
};

function findRowsByText(html: string, searchText: string): Data {
  const $ = load(html);
  const tables = $("table");
  let matchedRowHTML: {
    [x: string]: string;
  }[][] = [];

  tables.each((index, table) => {
    const tableRows = $(table).find("tr");
    const tableId = $(table).parent().parent().attr("id") || "";
    const buttonId = `sheet-button-${tableId}`;
    const buttonText = $(table).parents().find(`#${buttonId}`).text();

    tableRows.each((index, row) => {
      const rowText = $(row).text().toLowerCase();
      if (removeDiacritics(rowText).includes(searchText.toLowerCase())) {
        const person = $(row)
          .find("td")
          .toArray()
          .filter((cell) => $(cell).text().trim() !== "")
          .map((cell, index) => ({
            [`${getTableHead($, tableRows, index)}`]: $(cell).text(),
          }));
        matchedRowHTML.push([...person, { id: buttonText }]);
      }
    });
  });

  return matchedRowHTML;
}

export async function GET(req: Request) {
  console.log("GET endpoint request");
  try {
    const searchParams = new URL(req.url).searchParams;
    const nameRaw = searchParams.get("name") || "";
    const name = removeDiacritics(nameRaw.trim().toLowerCase());
    console.log("name:", name);

    if (name === "") {
      return new Response(
        JSON.stringify({ validation: "nome é obrigatório" }),
        {
          status: 200,
        }
      );
    }

    const response = await fetch(DRIVE_URL);
    const html = await response.text();

    const data = findRowsByText(html, name);

    const result = data;

    return new Response(JSON.stringify({ data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    return new Response(JSON.stringify({ data: "Erro no servidor" }), {
      status: 500,
    });
  }
}
