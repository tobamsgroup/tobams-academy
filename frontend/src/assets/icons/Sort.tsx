import { Iconprops } from "@/types"
import React, { FC } from "react"
const Sort: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 16}
    height={props?.height || 16}
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      fill="#474348"
      d="M8.472 2.195a.667.667 0 0 0-.943 0l-4 4a.667.667 0 1 0 .943.943L8 3.61l3.529 3.53a.667.667 0 1 0 .943-.944l-4-4ZM8.472 14.471a.667.667 0 0 1-.943 0l-4-4a.667.667 0 1 1 .943-.942L8 13.057 11.53 9.53a.667.667 0 0 1 .943.942l-4 4Z"
    />
  </svg>
)
export default Sort
