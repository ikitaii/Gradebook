import { saveAs } from "file-saver";
export const exportCsv = (
  fileName: string,
  rows: string[][]
) => {
  const csvContent = rows
    .map((row) => row.join(";"))
    .join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  saveAs(blob, `${fileName}.csv`);
};