import { Iconprops } from "@/types";
import React, { FC } from "react";

const Cart: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#303869"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "2"}
      d="M6 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 0h11M6 17V3H4m13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM6 5l14 1-1 7H6"
    />
  </svg>
);

export default Cart;
