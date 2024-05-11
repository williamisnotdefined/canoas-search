import { promises as fs } from "fs";

export async function logName(name: string): Promise<void> {
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

    console.log(`Searched name: ${name}`);
  } catch (err) {
    console.error("[logName] Error writing to log file:", err);
  }
}

export async function logError(error: string): Promise<void> {
  try {
    const fileHandle = await fs.open("error_log.txt", "a");
    await fileHandle.appendFile(`${error}\n\n\n-------\n\n\n`, "utf-8");
    await fileHandle.close();

    console.log(`Error: ${error}`);
  } catch (err) {
    console.error("[logError] Error writing to log file:", err);
  }
}

export async function logDuration(message: string): Promise<void> {
  try {
    const fileHandle = await fs.open("request_time_log.txt", "a");
    await fileHandle.appendFile(`${message}\n`, "utf-8");
    await fileHandle.close();

    console.log(`Request time spent: ${message}`);
  } catch (err) {
    console.error("[logDuration] Error writing to log file:", err);
  }
}
