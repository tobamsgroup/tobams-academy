import { Iconprops } from "@/types";
import React, { FC } from "react";

const Ngo: FC<Iconprops> = (props) => {
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
        d="M2.5 17.5h15m-13.333 0V5.833L10.833 2.5v15m5 0V9.167l-5-3.334M7.5 7.5v.008M7.5 10v.008m0 2.492v.008M7.5 15v.008"
      />
    </svg>
  );
};

export default Ngo;
