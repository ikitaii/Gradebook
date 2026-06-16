import React from "react";

interface GradeCellProps {
  value: number;
}

export const GradeCell: React.FC<GradeCellProps> = ({ value }) => {
  let bgColor = "bg-red-100 text-red-700";
  if (value >= 9) {
    bgColor = "bg-green-100 text-green-700";
  } else if (value >= 7) {
    bgColor = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span className={`${bgColor} px-2 py-1 rounded-full text-sm`}> {value} </span>
  );
};
