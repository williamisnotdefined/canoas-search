import { promises as fs } from "fs";

export default async function (filePath: string): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    const lines = data.split("\n");

    const names = lines.map((line) => {
      const [name] = line.split(",");
      return name;
    });

    return names;
  } catch (error) {
    console.error("Error reading the file:", error);
    return [];
  }
}
