import { Iconprops } from "@/types";
import React, { FC } from "react";

const CircleMinus: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 26}
    viewBox="0 0 24 26"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#221D23"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "2"}
      d="M9 14h6M3 14a9 9 0 1 0 18.001 0A9 9 0 0 0 3 14Z"
    />
  </svg>
);

export default CircleMinus;
