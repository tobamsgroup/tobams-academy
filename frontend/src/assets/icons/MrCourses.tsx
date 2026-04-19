import { Iconprops } from "@/types";
import React, { FC } from "react";

const MrCourses: FC<Iconprops> = (props) => {
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
        strokeWidth={props?.strokeWidth || "2"}
        d="M4.167 10h11.667m0 0L12.5 13.333M15.834 10 12.5 6.667"
      />
    </svg>
  );
};

export default MrCourses;
