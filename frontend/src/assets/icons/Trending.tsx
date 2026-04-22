import { Iconprops } from "@/types";
import React, { FC } from "react";

const Trending: FC<Iconprops> = (props) => {
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
        stroke={props?.stroke || "#B83092"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "1.5"}
        d="M9.75 12.75h-6.5a2.5 2.5 0 0 1 0-5h.5m9 2v6.5a2.5 2.5 0 0 1-5 0v-.5m2-9h6.5a2.5 2.5 0 0 1 0 5h-.5m-9-2v-6.5a2.5 2.5 0 1 1 5 0v.5"
      />
    </svg>
  );
};

export default Trending;
