import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileTwitter: FC<Iconprops> = (props) => (
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
      d="M18.335 3.342c-.834.409-1.65.574-2.5.825-.935-1.054-2.32-1.112-3.65-.614C10.854 4.051 9.982 5.27 10 6.667V7.5c-2.704.07-5.112-1.162-6.666-3.333 0 0-3.485 6.194 3.333 9.167-1.56 1.039-3.116 1.74-5 1.667 2.757 1.502 5.76 2.019 8.362 1.264 2.983-.867 5.435-3.103 6.376-6.452.28-1.019.42-2.071.414-3.128 0-.207 1.258-2.31 1.515-3.344v.001Z"
    />
  </svg>
);

export default ProfileTwitter;