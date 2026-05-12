import { Iconprops } from "@/types";
import React, { FC } from "react";

const PaymentDate: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "#6C686C"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M13.334 2.5v3.333M6.667 2.5v3.333M3.334 9.167h13.333M3.333 5.833A1.667 1.667 0 0 1 5 4.167h10a1.667 1.667 0 0 1 1.667 1.666v10A1.667 1.667 0 0 1 15 17.5H5a1.667 1.667 0 0 1-1.667-1.667v-10Zm5.834 7.5a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0Z"
    />
  </svg>
);

export default PaymentDate;
