import { Iconprops } from "@/types";
import React, { FC } from "react";

const Innovation: FC<Iconprops> = (props) => {
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
        d="M4.063 11.342a3.333 3.333 0 1 0 5.104 2.825h5m-1.612 2.918a3.332 3.332 0 1 0 1.612-6.252c-.589 0-1.187.15-1.667.417L10 6.667m3.333 0a3.333 3.333 0 0 0-6.666 0c0 1.255.641 2.348 1.666 2.916l-2.5 4.584"
      />
    </svg>
  );
};

export default Innovation;
