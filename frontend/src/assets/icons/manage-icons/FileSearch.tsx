import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManageFileSearch: FC<Iconprops> = (props) => {
  const stroke = props?.stroke || "currentColor";
  const strokeWidth = props?.strokeWidth || "1.5";

  return (
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
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      />
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M14 2v5a1 1 0 0 0 1 1h5"
      />
      <circle
        cx="11.5"
        cy="14.5"
        r="2.5"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M13.3 16.3 15 18"
      />
    </svg>
  );
};

export default ManageFileSearch;
