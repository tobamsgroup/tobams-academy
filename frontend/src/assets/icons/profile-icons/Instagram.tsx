import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileInstagram: FC<Iconprops> = (props) => (
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
      d="M13.749 6.25v.009m-10.417.408a3.333 3.333 0 0 1 3.333-3.333h6.667a3.334 3.334 0 0 1 3.333 3.333v6.667a3.333 3.333 0 0 1-3.333 3.333H6.665a3.333 3.333 0 0 1-3.333-3.333V6.667Zm4.167 3.334a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
    />
  </svg>
);

export default ProfileInstagram;
