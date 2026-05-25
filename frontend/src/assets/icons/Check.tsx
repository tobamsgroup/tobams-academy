import { Iconprops } from "@/types";
import React, { FC } from "react";

const Check: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 20}
    height={props?.height || 20}
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      fill="#303869"
      d="M15 1.34A10 10 0 1 1 .005 10.324L0 10l.005-.324A10 10 0 0 1 15 1.34Zm-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L9 10.585 7.707 9.293l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094 2 2 .094.083a1 1 0 0 0 1.226 0l.094-.083 4-4 .083-.094a1 1 0 0 0-.083-1.32Z"
    />
  </svg>
)
export default Check;
