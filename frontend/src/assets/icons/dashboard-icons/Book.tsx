import { Iconprops } from "@/types";
import React, { FC } from "react";

const DashboardBook: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 10}
    height={props?.height || 10}
    viewBox="0 0 10 10"
    fill="none"
    className={props?.className}
    onClick={props?.onClick}
  >
    <path
      stroke={props?.stroke || "#303869"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props?.strokeWidth || "0.9"}
      d="M5 3.125c.313-1.234 1.493-1.863 4.063-1.875a.311.311 0 0 1 .312.313v5.625a.312.312 0 0 1-.313.312c-2.5 0-3.465.504-4.062 1.25m0-5.625C4.687 1.891 3.507 1.262.938 1.25a.311.311 0 0 0-.313.313V7.15c0 .193.12.35.313.35 2.5 0 3.469.508 4.062 1.25m0-5.625V8.75"
    />
  </svg>
);

export default DashboardBook;
