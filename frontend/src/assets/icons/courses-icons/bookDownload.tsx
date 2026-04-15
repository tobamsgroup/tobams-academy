import { Iconprops } from "@/types";
import React, { FC } from "react";

const BookDownload: FC<Iconprops> = (props) => (
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
      d="M10 16.667H5A1.667 1.667 0 0 1 3.333 15m0 0V5A1.667 1.667 0 0 1 5 3.333h10V7.5M3.333 15A1.667 1.667 0 0 1 5 13.333h5.833m1.667 2.5 2.5 2.5m0 0 2.5-2.5m-2.5 2.5v-7.5"
    />
  </svg>
);

export default BookDownload;
