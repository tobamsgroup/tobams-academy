import { Iconprops } from "@/types";
import React, { FC } from "react";

const Bussiness: FC<Iconprops> = (props) => {
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
        d="M8.333 10H2.5m0 0L5 7.5M2.5 10 5 12.5m6.667-2.5H17.5m0 0L15 7.5m2.5 2.5L15 12.5M2.5 5V2.5h15V5m-15 10v2.5h15V15"
      />
    </svg>
  );
};

export default Bussiness;
