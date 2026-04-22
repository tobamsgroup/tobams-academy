import { Iconprops } from "@/types";
import React, { FC } from "react";

const WhiteArrow: FC<Iconprops> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || 24}
      height={props?.height || 24}
      fill="none"
      className={props?.className}
      onClick={props?.onClick}
    >
      <path
        stroke={props?.stroke || "#fff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "1.5"}
        d="M5 12h14m0 0-4 4m4-4-4-4"
      />
    </svg>
  );
};

export default WhiteArrow;
