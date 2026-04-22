import { Iconprops } from "@/types";
import React, { FC } from "react";

const RoundedCircle: FC<Iconprops> = (props) => {
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
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "2"}
        d="M8 11a5 5 0 1 0 3.998 1.997m.004 6.006A5 5 0 1 0 16 11M7 8a5 5 0 1 0 10 0A5 5 0 0 0 7 8Z"
      />
    </svg>
  );
};

export default RoundedCircle;
