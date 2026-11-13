import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManageReload: FC<Iconprops> = (props) => (
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
      d="M4.067 13.042a8 8 0 1 0 9.925-8.788c-3.9-1-7.935 1.007-9.425 4.747M4 4v5h5"
    />
  </svg>
);

export default ManageReload;
