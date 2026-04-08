import { Iconprops } from "@/types";
import React, { FC } from "react";

const IT: FC<Iconprops> = (props) => {
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
        d="M1.667 10h7.5m3.333 0h5.834M9.167 4.167v11.666M12.5 7.5v5m-10-8.333h3.334M4.167 2.5v3.333"
      />
    </svg>
  );
};

export default IT;
