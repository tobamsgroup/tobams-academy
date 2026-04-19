import { Iconprops } from "@/types";
import React, { FC } from "react";

const SquareCheck: FC<Iconprops> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || 28}
      height={props?.height || 28}
      viewBox="0 0 28 28"
      fill="none"
      className={props?.className}
      onClick={props?.onClick}
    >
      <path
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "2"}
        d="m10.5 14 2.333 2.333 4.667-4.666M14 3.5c8.4 0 10.5 2.1 10.5 10.5S22.4 24.5 14 24.5 3.5 22.4 3.5 14 5.6 3.5 14 3.5Z"
      />
    </svg>
  );
};

export default SquareCheck;
