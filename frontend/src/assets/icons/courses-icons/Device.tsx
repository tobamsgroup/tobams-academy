import { Iconprops } from "@/types";
import React, { FC } from "react";

const Device: FC<Iconprops> = (props) => (
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
      d="M13.333 2.5 10 5.833 6.667 2.5M2.5 7.5a1.667 1.667 0 0 1 1.667-1.667h11.666A1.666 1.666 0 0 1 17.5 7.5V15a1.666 1.666 0 0 1-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 15V7.5Z"
    />
  </svg>
);

export default Device;
