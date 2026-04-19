import { Iconprops } from "@/types";
import React, { FC } from "react";

const CirclePlus: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "#C3C0B7"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "2"}
      d="M9 12h6m-3-3v6m-9-3a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12Z"
    />
  </svg>
);

export default CirclePlus;
