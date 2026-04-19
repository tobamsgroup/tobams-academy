import { Iconprops } from "@/types";
import React, { FC } from "react";

const Certificate: FC<Iconprops> = (props) => (
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
      d="M10.833 14.583v3.75l1.667-1.25 1.667 1.25v-3.75m-5.834 1.25H4.167A1.667 1.667 0 0 1 2.5 14.167V5.833c0-.916.75-1.666 1.667-1.666h11.666A1.666 1.666 0 0 1 17.5 5.833v8.334a1.667 1.667 0 0 1-.833 1.441M5 7.5h10M5 10h2.5M5 12.5h1.667m3.333 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
    />
  </svg>
);

export default Certificate;
