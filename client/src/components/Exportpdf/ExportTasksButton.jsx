import React from "react";
import { pdf } from "@react-pdf/renderer";
import AssignedTasksPdf from "./AssignedTasksPdf";

const ExportTasksButton = ({ tasks }) => {
  const handlePrintAndDownload = async () => {
    const blob = await pdf(<AssignedTasksPdf tasks={tasks} />).toBlob();

    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.focus();
        newWindow.print();
      };
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = "assigned-tasks-report.pdf";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handlePrintAndDownload}
    >
      🖨️ Print & 📄 Download PDF
    </button>
  );
};

export default ExportTasksButton;
