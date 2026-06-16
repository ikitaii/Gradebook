import React from "react";
import { Check, XCircle, Clock } from "lucide-react";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface AttendanceIconProps {
  status: AttendanceStatus;
}

export const AttendanceIcon: React.FC<AttendanceIconProps> = ({ status }) => {
  let className = "text-gray-400";

  switch (status) {
    case "PRESENT":
      className = "text-green-600";
      break;
    case "ABSENT":
      className = "text-red-600";
      break;
    case "LATE":
      className = "text-yellow-600";
      break;
  }

  const Icon = {
    PRESENT: <Check className={className} />,
    ABSENT: <XCircle className={className} />,
    LATE: <Clock className={className} />,
  }[status];

  return <span className="w-5 h-5">{Icon}</span>;
};
