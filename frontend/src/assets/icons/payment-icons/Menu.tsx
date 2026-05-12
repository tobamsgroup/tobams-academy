import { Iconprops } from "@/types"
import React, { FC } from "react"
const PaymentMenu: FC<Iconprops> = (props)  => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      fill={props?.stroke || "#151515"}
      d="M11.25 3.333a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM11.25 10a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM10 17.916a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
    />
  </svg>
)
export default PaymentMenu
