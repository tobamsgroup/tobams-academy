import { Iconprops } from "@/types";
import React, { FC } from "react";

const LeftArrow: FC<Iconprops> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || 32}
      height={props?.height || 32}
      fill="none"
      className={props?.className}
      onClick={props?.onClick}
    >
      <path
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "2"}
        d="M6.667 16h18.666M6.667 16 12 21.333M6.667 16 12 10.666"
      />
    </svg>
  );
};

export default LeftArrow;
