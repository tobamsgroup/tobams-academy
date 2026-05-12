import { Iconprops } from "@/types";
import React, { FC } from "react";

const PaymentFlash: FC<Iconprops> = (props) => (
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
      d="M10.833 2.5v5.833h5L9.166 17.5v-5.833h-5L10.834 2.5Z"
    />
  </svg>
);

export default PaymentFlash;
