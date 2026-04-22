import { Iconprops } from "@/types";
import React, { FC } from "react";

const Mail: FC<Iconprops> = (props) => {
  return (
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
        fill={props?.color || "#fff"}
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
      />
    </svg>
  );
};

export default Mail;
