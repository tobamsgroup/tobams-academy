import { Iconprops } from "@/types";
import React, { FC } from "react";

const Twitter: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 22}
    height={props?.height || 20}
    viewBox="0 0 22 20"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      fill={props?.color || "currentColor"}
      d="M0 0h2.5l15 20H15L0 0ZM4.5 0H7l15 20h-2.5L4.5 0Z"
    />
    <path
      fill={props?.color || "currentColor"}
      d="M2 0h5v2H2V0ZM15 20h5v-2h-5v2ZM17.5 0H21L4 20H.5l17-20Z"
    />
  </svg>
);

export default Twitter;
