import { remove as removeDiacritics } from "diacritics";
import { promises as fs } from "fs";

import { logError, logName, logDuration } from "@/logger";
import { type Data } from "@/tasks/scrape/core/sources";

export const dynamic = "force-dynamic";

function filterByValue(data: Data, name: string): Data {
  return data.filter((innerArray) =>
    innerArray.some((object) =>
      Object.values(object).some((value) =>
        removeDiacritics(value || "")
          .toLowerCase()
          .includes(name),
      ),
    ),
  );
}

export async function GET(req: Request) {
  const start = Date.now();

  try {
    const searchParams = new URL(req.url).searchParams;
    const nameRaw = searchParams.get("name") || "";
    const name = removeDiacritics(
      nameRaw.trim().replace(/  +/g, " ").toLowerCase(),
    );

    if (name === "") {
      return new Response(
        JSON.stringify({ validation: "nome é obrigatório" }),
        {
          status: 200,
        },
      );
    }

    await logName(name);

    const tosalvoRaw = await fs.readFile("./public/tosalvocanoas.json", "utf8");
    const tosalvoData = JSON.parse(tosalvoRaw) as Data;

    const prefeituraRaw = await fs.readFile(
      "./public/prefeituracanoas.json",
      "utf8",
    );
    const prefeituraData = JSON.parse(prefeituraRaw) as Data;

    const dataMerged = [...prefeituraData, ...tosalvoData];
    const registersCount = dataMerged.length;

    const data = filterByValue(dataMerged, name);

    await logDuration(`[SUCCESS] Request processed in ${Date.now() - start}ms`);

    return new Response(
      JSON.stringify({
        data,
        registersCount,
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
