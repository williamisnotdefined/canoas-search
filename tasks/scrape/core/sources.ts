export const DRIVE_URL = {
  TOSALVOCANOAS:
    "https://docs.google.com/spreadsheets/d/1-1q4c8Ns6M9noCEhQqBE6gy3FWUv-VQgeUO9c7szGIM/htmlview#",
  PREFEITURA_CANOAS:
    "https://docs.google.com/spreadsheets/d/1f5gofOOv4EFYWhVqwPWbgF2M-7uHrJrCMiP7Ug4y6lQ/htmlview#",
};

export enum Source {
  TOSALVOCANOAS = "@tosalvocanoas",
  PREFEITURA_CANOAS = "prefeitura de canoas",
}

export type Data = { [x: string]: string | null | undefined }[][];
/*
Example of data structure:
const sampleData: Data = [
  [{ "name": "John" }, { "age": "30" }, { "city": "New York" }],
  [{ "name": "Alice" }, { "city": "Los Angeles" }],
  [{ "age": "30" }, { "city": "Chicago" }, { "name": "Alice" }]
];
*/
