import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManageRotateClock: FC<Iconprops> = (props) => (
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
      strokeWidth={props?.strokeWidth || "2"}
      d="M19.95 13a8 8 0 1 1-.5-4m.5-5v5h-5"
    />
  </svg>
);

export default ManageRotateClock;
