import { promises as fs } from "fs";

export default async function logNameToTxt(name: string): Promise<void> {
  try {
    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const logLine = `${name}, ${timestamp}\n`;

    const fileHandle = await fs.open("name_log.txt", "a");
    await fileHandle.appendFile(logLine, "utf-8");
    await fileHandle.close();

    console.log(`Logged name: ${name}`);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
}
