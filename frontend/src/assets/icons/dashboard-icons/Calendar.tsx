import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardCalendar: FC<Iconprops> = (props) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "0.8"}
      d="M6.665.832v1.667M3.332.832v1.667M5.417 1.668h-.834c-1.571 0-2.357 0-2.845.488S1.25 3.43 1.25 5.001v.834c0 1.571 0 2.357.488 2.845s1.274.488 2.845.488h.834c1.571 0 2.357 0 2.845-.488s.488-1.274.488-2.845V5c0-1.571 0-2.357-.488-2.845s-1.274-.488-2.845-.488ZM1.25 4.168h7.5"
    />
  </svg>
);

export default DashboardCalendar;