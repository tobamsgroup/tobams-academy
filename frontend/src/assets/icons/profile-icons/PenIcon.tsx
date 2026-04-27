import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfilePenIcon: FC<Iconprops> = (props) => (
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
      d="m11.25 5.416 3.334 3.334m-11.25 7.916h3.333l8.75-8.75a2.357 2.357 0 0 0-3.333-3.333l-8.75 8.75v3.333Z"
    />
  </svg>
);

export default ProfilePenIcon;
