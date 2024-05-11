import { writeFile } from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

export default async function dataToJSON(
  filename: string,
  data: any,
): Promise<void> {
  try {
    const jsonFilename = filename.endsWith(".json")
      ? filename
      : `${filename}.json`;

    const jsonString = JSON.stringify(data);
    await writeFileAsync(`public/${jsonFilename}`, jsonString, "utf8");
  } catch (err) {
    console.error(`[dataToJSON] Error generating json filename: `, err);
  }
}
