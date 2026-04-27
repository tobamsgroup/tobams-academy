import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardLogout: FC<Iconprops> = (props) => (
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
      fill={props?.color || "#221D23"}
      d="M7.5 4a1 1 0 1 0 0-2H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h1.5a1 1 0 1 0 0-2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1.5Z"
    />
    <path
      fill={props?.color || "#221D23"}
      d="M22.707 12.707a1 1 0 0 0 0-1.414l-4-4a1 1 0 1 0-1.414 1.414L19.586 11H8a1 1 0 1 0 0 2h11.586l-2.293 2.293a1 1 0 0 0 1.414 1.414l4-4Z"
    />
  </svg>
);

export default DashboardLogout;
