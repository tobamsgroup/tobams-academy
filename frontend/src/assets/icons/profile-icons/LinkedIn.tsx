import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileLinkedIn: FC<Iconprops> = (props) => (
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
      d="M6.665 9.167v4.167m0-6.667v.009M10 13.334V9.167m3.333 4.167v-2.5a1.667 1.667 0 0 0-3.333 0M3.332 5.001a1.667 1.667 0 0 1 1.667-1.667h10a1.667 1.667 0 0 1 1.666 1.667v10A1.667 1.667 0 0 1 15 16.667h-10a1.667 1.667 0 0 1-1.667-1.666V5Z"
    />
  </svg>
);

export default ProfileLinkedIn;
