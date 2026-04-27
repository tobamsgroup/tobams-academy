import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardClock: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 10}
    height={props?.height || 10}
    viewBox="0 0 10 10"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#474348"}
      strokeWidth={props?.strokeWidth || "0.8"}
      d="M5.003 9.165a4.167 4.167 0 1 0 0-8.333 4.167 4.167 0 0 0 0 8.333Z"
    />
    <path
      stroke={props?.stroke || "#474348"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "0.8"}
      d="M5 3.332v1.667l.833.833"
    />
  </svg>
);

export default DashboardClock;