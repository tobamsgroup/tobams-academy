import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManagePlaylistAdd: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#221D23"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "2"}
      d="M19 8H5m0 4h9m-3 4H5m10 0h6m-3-3v6"
    />
  </svg>
);

export default ManagePlaylistAdd;
