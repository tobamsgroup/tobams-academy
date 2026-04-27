import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileFacebook: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "#474348"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M5.832 8.333v3.334h2.5V17.5h3.333v-5.833h2.5L15 8.333h-3.334V6.667a.834.834 0 0 1 .834-.834h2.5V2.5h-2.5a4.167 4.167 0 0 0-4.167 4.167v1.666h-2.5Z"
    />
  </svg>
);

export default ProfileFacebook;
