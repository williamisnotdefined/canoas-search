import { load, Element, CheerioAPI, Cheerio } from "cheerio";

import { Source } from "./sources";

type Data = { [x: string]: string | null | undefined }[][];

const getTableHead = (
  $: CheerioAPI,
  tableRows: Cheerio<Element>,
  index: number,
) => {
  return $(tableRows[1])
    .find("td")
    .toArray()
    .map((cell) => $(cell).text())[index];
};

export default function HTMLToData(html: string, source: Source): Data {
  const $ = load(html);
  const tables = $("table");
  const matchedRowHTML: {
    [x: string]: string | null | undefined;
  }[][] = [];

  tables.each((index, table) => {
    const tableRows = $(table).find("tr");
    const tableId = $(table).parent().parent().attr("id") || "";
    const buttonId = `sheet-button-${tableId}`;
    const buttonText = $(table).parents().find(`#${buttonId}`).text();

    tableRows.each((index, row) => {
      const person = $(row)
        .find("td")
        .toArray()
        .map((cell, index) => {
          let cellText = $(cell).html();

          const includesBr = cellText?.includes("<br>");
          const isToSalvoCanoasWithBr =
            includesBr && source === Source.TOSALVOCANOAS;

          if (isToSalvoCanoasWithBr) {
            cellText = (cellText as string)?.split("<br>").join(", ");
          }

          return {
            [`${getTableHead($, tableRows, index)}`]: isToSalvoCanoasWithBr
              ? cellText
              : $(cell).text() || " - ",
          };
        });
      matchedRowHTML.push([
        ...person,
        { id: buttonText },
        { "lista de origem": source },
      ]);
    });
  });

  return matchedRowHTML;
}
