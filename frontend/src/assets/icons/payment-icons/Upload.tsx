import { Iconprops } from "@/types"
import React, { FC } from "react"
const PaymentUpload: FC<Iconprops> = (props)  => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2m-3-8-5-5-5 5m5-5v12"
    />
  </svg>
)
export default PaymentUpload
