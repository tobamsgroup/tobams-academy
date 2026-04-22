import { Iconprops } from "@/types";
import React, { FC } from "react";

const Interview: FC<Iconprops> = (props) => {
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
        d="M10 17.5a7.5 7.5 0 0 1 0-15c4.142 0 7.5 2.985 7.5 6.667 0 .883-.395 1.731-1.098 2.356-.704.625-1.658.977-2.652.977h-2.083a1.666 1.666 0 0 0-.834 3.125A1.083 1.083 0 0 1 10 17.5Z"
      />
      <path
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "1.5"}
        d="M6.25 8.75a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0ZM9.583 6.25a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0ZM12.917 8.75a.834.834 0 1 0 1.667 0 .834.834 0 0 0-1.667 0Z"
      />
    </svg>
  );
};

export default Interview;
