import { Iconprops } from "@/types";
import React, { FC } from "react";

const Lifebuoy: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "#474348"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="m12.5 12.5 2.792 2.792M7.5 12.5l-2.792 2.792m0-10.584L7.5 7.5m7.792-2.792L12.5 7.5M6.667 10a3.333 3.333 0 1 0 6.666 0 3.333 3.333 0 0 0-6.666 0ZM2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0Z"
    />
  </svg>
);

export default Lifebuoy;
