import { Iconprops } from "@/types";
import React, { FC } from "react";

const Hands: FC<Iconprops> = (props) => (
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
      d="M11 5.5a1.5 1.5 0 0 0-3 0V13l-1.47-1.47a1.868 1.868 0 0 0-2.28-.28 1.5 1.5 0 0 0-.536 2.022C5.594 16.612 6.688 18.521 7 19l.196.3a6 6 0 0 0 5.012 2.7H12h2a6 6 0 0 0 6-6V7.5a1.5 1.5 0 0 0-3 0m-6-2V12m0-6.5v-2a1.5 1.5 0 1 1 3 0V12m0-6.5a1.5 1.5 0 1 1 3 0V12"
    />
  </svg>
);

export default Hands;
