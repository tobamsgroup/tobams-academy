import { Iconprops } from "@/types";
import React, { FC } from "react";

const Facebook: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <g clipPath="url(#facebook_clip)">
      <path
        fill={props?.color || "currentColor"}
        d="M23.5 12.07C23.5 5.717 18.351.57 12 .57S.5 5.717.5 12.07c0 5.74 4.205 10.497 9.703 11.36v-8.036h-2.92v-3.325h2.92V9.536c0-2.882 1.717-4.474 4.344-4.474 1.258 0 2.574.224 2.574.224v2.83h-1.45c-1.429 0-1.874.887-1.874 1.796v2.157h3.19l-.51 3.325h-2.68v8.036c5.498-.863 9.703-5.62 9.703-11.36Z"
      />
    </g>
    <defs>
      <clipPath id="facebook_clip">
        <path fill={props?.color || "currentColor"} d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default Facebook;
