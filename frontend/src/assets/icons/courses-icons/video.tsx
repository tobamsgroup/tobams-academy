import { Iconprops } from "@/types";
import React, { FC } from "react";

const Video: FC<Iconprops> = (props) => (
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
      d="m12.5 8.333 3.794-1.896a.833.833 0 0 1 1.206.745v5.636a.833.833 0 0 1-1.206.745L12.5 11.667V8.333Z"
    />
    <path
      stroke={props?.stroke || "#474348"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M2.5 6.667A1.667 1.667 0 0 1 4.167 5h6.666A1.666 1.666 0 0 1 12.5 6.667v6.666A1.666 1.666 0 0 1 10.833 15H4.167A1.667 1.667 0 0 1 2.5 13.333V6.667Z"
    />
  </svg>
);

export default Video;
