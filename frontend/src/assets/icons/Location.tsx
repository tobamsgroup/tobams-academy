import { Iconprops } from "@/types";
import React, { FC } from "react";

const Location: FC<Iconprops> = (props) => {
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
        d="M12 11.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
      />
    </svg>
  );
};

export default Location;
