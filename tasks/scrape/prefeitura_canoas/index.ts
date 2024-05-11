import { logTaskError } from "@/logger";

import dataToJSON from "../core/dataToJSON";
import HTMLToData from "../core/HTMLToData";
import { DRIVE_URL, Source } from "../core/sources";

const task = async () => {
  try {
    const res = await fetch(DRIVE_URL.PREFEITURA_CANOAS);
    const html = await res.text();
    const data = HTMLToData(html, Source.PREFEITURA_CANOAS);
    await dataToJSON("prefeituracanoas", data);
  } catch (error) {
    console.error("Error in task", error);
    logTaskError(`Error in task PREFEITURA_CANOAS: ${error}`);
  }
};

export default task;
