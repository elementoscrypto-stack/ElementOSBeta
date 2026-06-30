import { useState } from "react";
import { createReport } from "../engines/reportEngine.js";

export function useReports() {
  const [reports, setReports] = useState([]);

  function saveReport(payload) {
    const report = createReport(payload);
    setReports((current) => [report, ...current]);
    return report;
  }

  return { reports, saveReport };
}
