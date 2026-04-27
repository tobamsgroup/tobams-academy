import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardSupport: FC<Iconprops> = (props) => (
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
      d="M4 14v-3a8 8 0 1 1 16 0v3M4 14a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Zm16 0a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1m2-5v3a2 2 0 0 1-2 2m0 0c0 1.657-2.686 3-6 3"
    />
  </svg>
);

export default DashboardSupport;
