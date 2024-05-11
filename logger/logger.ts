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

    const fileHandle = await fs.open("logs/name_log.txt", "a");
    await fileHandle.appendFile(logLine, "utf-8");
    await fileHandle.close();

    console.log(`Searched name: ${name}`);
  } catch (err) {
    console.error("[Name Log] Error writing to log file:", err);
  }
}

export async function logDuration(message: string): Promise<void> {
  try {
    const fileHandle = await fs.open("logs/request_time_log.txt", "a");
    await fileHandle.appendFile(`${message}\n`, "utf-8");
    await fileHandle.close();

    console.log(`Request time spent: ${message}`);
  } catch (err) {
    console.error("[Duration Log] Error writing to log file:", err);
  }
}

export async function logError(error: string): Promise<void> {
  try {
    const fileHandle = await fs.open("logs/error_log.txt", "a");
    await fileHandle.appendFile(`${error}\n-------\n`, "utf-8");
    await fileHandle.close();

    console.log(`Error: ${error}`);
  } catch (err) {
    console.error("[Error Log] Error writing to log file:", err);
  }
}

export async function logTaskError(error: string): Promise<void> {
  try {
    const fileHandle = await fs.open("logs/task_error_log.txt", "a");
    await fileHandle.appendFile(`${error}\n-------\n`, "utf-8");
    await fileHandle.close();

    console.log(`Error: ${error}`);
  } catch (err) {
    console.error("[Task Error Log] Error writing to log file:", err);
  }
}
