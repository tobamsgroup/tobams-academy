import { Iconprops } from "@/types";
import React, { FC } from "react";

const Leadership: FC<Iconprops> = (props) => {
  return (
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
        stroke={props?.stroke || "#221D23"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props?.strokeWidth || "1.5"}
        d="M4.166 18.333v-4.166l-.833-.834V10a.833.833 0 0 1 .833-.833H7.5a.833.833 0 0 1 .833.833v3.333l-.833.834v4.166m5 0V15h-1.667l1.667-5a.833.833 0 0 1 .833-.833H15a.833.833 0 0 1 .833.833l1.667 5h-1.667v3.333M4.166 4.167a1.667 1.667 0 1 0 3.334 0 1.667 1.667 0 0 0-3.334 0Zm8.334 0a1.667 1.667 0 1 0 3.333 0 1.667 1.667 0 0 0-3.333 0Z"
      />
    </svg>
  );
};

export default Leadership;
