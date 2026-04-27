import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardProfile: FC<Iconprops> = (props) => (
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
      d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
    />
    <path
      stroke={props?.stroke || "#221D23"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M3 21c0-4 4-7 9-7s9 3 9 7"
    />
  </svg>
);

export default DashboardProfile;
