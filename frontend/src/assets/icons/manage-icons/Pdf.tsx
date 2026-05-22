import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManagePdf: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M3 12h2a2 2 0 1 0 0-4H3v8m14-4h3m1-4h-4v8m-7-8v8h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2Z"
    />
  </svg>
);

export default ManagePdf;
