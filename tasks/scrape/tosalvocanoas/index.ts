import { logTaskError } from "@/logger";

import dataToJSON from "../core/dataToJSON";
import HTMLToData from "../core/HTMLToData";
import { DRIVE_URL, Source } from "../core/sources";

const task = async () => {
  try {
    const res = await fetch(DRIVE_URL.TOSALVOCANOAS);
    const html = await res.text();
    const data = HTMLToData(html, Source.TOSALVOCANOAS);
    await dataToJSON("tosalvocanoas", data);
  } catch (error) {
    console.error("Error in task", error);
    logTaskError(`Error in task TOSALVO_CANOAS: ${error}`);
  }
};

export default task;
