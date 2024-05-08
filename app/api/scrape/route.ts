import { load, Element, CheerioAPI, Cheerio } from "cheerio";
import { remove as removeDiacritics } from "diacritics";
import fetch from "node-fetch";

import logNameToTxt from "./logNameToTxt";

const DRIVE_URL_TO_SALVO =
  "https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#";
const DRIVE_URL_PREF =
  "https://docs.google.com/spreadsheets/d/1f5gofOOv4EFYWhVqwPWbgF2M-7uHrJrCMiP7Ug4y6lQ/htmlview#";

enum Source {
  TOSALVO = "@tosalvocanoas",
  PREF = "prefeitura de canoas",
}

type Data = { [x: string]: string | null | undefined }[][];

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

function findRowsByText(
  html: string,
  searchText: string,
  source: Source
): Data {
  const $ = load(html);
  const tables = $("table");
  let matchedRowHTML: {
    [x: string]: string | null | undefined;
  }[][] = [];

  tables.each((index, table) => {
    const tableRows = $(table).find("tr");
    const tableId = $(table).parent().parent().attr("id") || "";
    const buttonId = `sheet-button-${tableId}`;
    const buttonText = $(table).parents().find(`#${buttonId}`).text();

    tableRows.each((index, row) => {
      const rowText = $(row).text().toLowerCase();
      if (removeDiacritics(rowText).includes(searchText)) {
        const person = $(row)
          .find("td")
          .toArray()
          .map((cell, index) => {
            let cellText = $(cell).html();

            let includesBr = cellText?.includes("<br>");
            if (includesBr && source === Source.TOSALVO) {
              cellText = (cellText as string)
                ?.split("<br>")
                .filter((cell) =>
                  removeDiacritics(cell).toLowerCase().includes(searchText)
                )
                .join(", ");
            }

            return {
              [`${getTableHead($, tableRows, index)}`]: includesBr
                ? cellText
                : $(cell).text() || " - ",
            };
          });
        matchedRowHTML.push([
          ...person,
          { id: buttonText },
          { "lista de origem": source },
        ]);
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

    if (name === "") {
      return new Response(
        JSON.stringify({ validation: "nome é obrigatório" }),
        {
          status: 200,
        }
      );
    }

    await logNameToTxt(name);

    const responseToSalvo = await fetch(DRIVE_URL_TO_SALVO);
    const htmlToSalvo = await responseToSalvo.text();
    const dataToSalvo = findRowsByText(htmlToSalvo, name, Source.TOSALVO);

    const responsePref = await fetch(DRIVE_URL_PREF);
    const htmlPref = await responsePref.text();
    const dataPref = findRowsByText(htmlPref, name, Source.PREF);

    return new Response(
      JSON.stringify({
        data: [...dataToSalvo, ...dataPref],
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error during scraping:", error);
    return new Response(JSON.stringify({ data: "Erro no servidor" }), {
      status: 500,
    });
  }
}
