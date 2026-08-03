import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManageArrowsHorizontal: FC<Iconprops> = (props) => (
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
      d="m18 15 3-3-3-3m3 3h-6m-9 3-3-3 3-3m-3 3h6"
    />
  </svg>
);

export default ManageArrowsHorizontal;
