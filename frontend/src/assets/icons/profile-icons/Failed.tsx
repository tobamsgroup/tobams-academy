import { Iconprops } from "@/types";
import React, { FC } from "react";

const ProfileFailed: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 60}
    height={props?.height || 60}
    viewBox="0 0 60 60"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <rect width={60} height={60} fill="#DE2121" fillOpacity={0.1} rx={30} />
    <path
      stroke={props?.stroke || "#DE2121"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.667"}
      d="M38.335 21.668 21.668 38.335m0-16.667 16.667 16.667"
    />
  </svg>
);

export default ProfileFailed;
