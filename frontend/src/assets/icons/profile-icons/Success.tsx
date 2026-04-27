import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileSuccess: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 67}
    height={props?.height || 67}
    viewBox="0 0 67 67"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <circle cx={33.147} cy={33.147} r={33.147} fill="#DBEFDC" />
    <path
      fill="#099137"
      fillRule="evenodd"
      d="M33.142 53.03c10.984 0 19.888-8.904 19.888-19.888 0-10.984-8.904-19.888-19.888-19.888-10.984 0-19.888 8.904-19.888 19.888 0 10.984 8.904 19.888 19.888 19.888Zm8.122-22.678a2.21 2.21 0 0 0-2.985-3.26l-8.159 7.473-2.115-1.937a2.21 2.21 0 1 0-2.985 3.259l3.608 3.304a2.21 2.21 0 0 0 2.985 0l9.65-8.84Z"
      clipRule="evenodd"
    />
  </svg>
);

export default ProfileSuccess;
