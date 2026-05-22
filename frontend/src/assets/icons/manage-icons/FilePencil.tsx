import { Iconprops } from "@/types";
import React, { FC } from "react";

const ManageFilePencil: FC<Iconprops> = (props) => (
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
      stroke={props?.stroke || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "1.5"}
      d="M14 3v4a1 1 0 0 0 1 1h4m0 0-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm-9 10 5-5a1.414 1.414 0 0 0-2-2l-5 5v2h2Z"
    />
  </svg>
);

export default ManageFilePencil;
