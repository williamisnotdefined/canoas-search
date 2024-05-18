import { remove as removeDiacritics } from "diacritics";
import { promises as fs } from "fs";

import { type Data } from "@/tasks/scrape/core/sources";

import fromLogToNameArray from "./fromLogToNameArray";

export const dynamic = "force-dynamic";

function getDataByName(data: Data, name: string): Data {
  return data.filter((innerArray) =>
    innerArray.some((object) =>
      Object.values(object).some((value) => {
        const strValue = removeDiacritics(value || "")
          .toLowerCase()
          .trim();
        if (strValue.includes(" ") && name.includes(" ")) {
          return name.split(" ").every((word) => strValue.includes(word));
        }

        return strValue.includes(name);
      }),
    ),
  );
}

export async function GET() {
  const names = await fromLogToNameArray("logs/name_log.txt");

  const tosalvoRaw = await fs.readFile("./public/tosalvocanoas.json", "utf8");
  const tosalvoData = JSON.parse(tosalvoRaw) as Data;

  const prefeituraRaw = await fs.readFile(
    "./public/prefeituracanoas.json",
    "utf8",
  );
  const prefeituraData = JSON.parse(prefeituraRaw) as Data;

  const dataMerged = [...prefeituraData, ...tosalvoData];

  const data = names.filter(
    (name) => getDataByName(dataMerged, name).length === 0,
  );

  return Response.json({ data, total: data.length });
}
