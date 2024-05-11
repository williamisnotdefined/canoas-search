import { remove as removeDiacritics } from "diacritics";
import fetch from "node-fetch";

import { Source } from "./@types";
import findNameInHtmlTable from "./htmlToData";
import { logError, logName, logDuration } from "./logger";

export const dynamic = "force-dynamic";

const DRIVE_URL_TO_SALVO =
  "https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#";
const DRIVE_URL_PREF =
  "https://docs.google.com/spreadsheets/d/1f5gofOOv4EFYWhVqwPWbgF2M-7uHrJrCMiP7Ug4y6lQ/htmlview#";

export async function GET(req: Request) {
  const start = Date.now();

  try {
    const searchParams = new URL(req.url).searchParams;
    const nameRaw = searchParams.get("name") || "";
    const name = removeDiacritics(nameRaw.trim().toLowerCase());

    if (name === "") {
      return new Response(
        JSON.stringify({ validation: "nome é obrigatório" }),
        {
          status: 200,
        },
      );
    }

    await logName(name);

    const responseToSalvo = await fetch(DRIVE_URL_TO_SALVO);
    const htmlToSalvo = await responseToSalvo.text();
    const dataToSalvo = findNameInHtmlTable(htmlToSalvo, name, Source.TOSALVO);

    const responsePref = await fetch(DRIVE_URL_PREF);
    const htmlPref = await responsePref.text();
    const dataPref = findNameInHtmlTable(htmlPref, name, Source.PREF);

    await logDuration(`[SUCCESS] Request processed in ${Date.now() - start}ms`);

    return new Response(
      JSON.stringify({
        data: [...dataPref, ...dataToSalvo],
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    await logDuration(`[ERROR] Request processed in ${Date.now() - start}ms`);
    await logError(`Error during scraping: ${error}`);

    return new Response(
      JSON.stringify({ data: "Erro no servidor, tente novamente." }),
      {
        status: 500,
      },
    );
  }
}
