import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardCourses: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#221D23"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M5 18a2 2 0 0 0 2 2h12V4H7a2 2 0 0 0-2 2v12Zm0 0a2 2 0 0 1 2-2h12M9 8h6"
    />
  </svg>
);

export default DashboardCourses;
