import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileMail: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 16}
    height={props?.height || 16}
    viewBox="0 0 24 24"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2"
      stroke={props?.stroke || "#474348"}
      strokeWidth={props?.strokeWidth || "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      stroke={props?.stroke || "#474348"}
      strokeWidth={props?.strokeWidth || "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProfileMail;
