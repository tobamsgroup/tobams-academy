import { Iconprops } from "@/types";
import React, { FC } from "react";

const Sustainability: FC<Iconprops> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || 20}
      height={props?.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      className={props?.className}
      onClick={props?.onClick}
    >
      <path
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "1.5"}
        d="M4.166 17.5C4.583 13.75 6.25 10.833 10 9.167M7.5 15c5.181 0 8.75-2.74 9.166-10V3.333h-3.345c-7.5 0-9.988 3.334-10 7.5 0 .834 0 2.5 1.667 4.167H7.5Z"
      />
    </svg>
  );
};

export default Sustainability;
