import { Iconprops } from "@/types";
import React, { FC } from "react";

const LinkedIn: FC<Iconprops> = (props) => (
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
      fill={props?.color || "currentColor"}
      fillRule="evenodd"
      d="M3.441 2C2.645 2 2 2.626 2 3.397v16.707c0 .77.646 1.396 1.441 1.396H20.06c.796 0 1.441-.625 1.441-1.397V3.397C21.5 2.626 20.855 2 20.059 2H3.44Zm4.485 7.54v8.779H5.008V9.54h2.918Zm.192-2.715c0 .842-.633 1.517-1.65 1.517h-.02c-.98 0-1.612-.675-1.612-1.517 0-.862.652-1.517 1.65-1.517.999 0 1.613.655 1.632 1.517Zm4.34 11.494H9.542s.038-7.955 0-8.779h2.918v1.243c.388-.598 1.082-1.449 2.63-1.449 1.92 0 3.359 1.255 3.359 3.951v5.034H15.53v-4.696c0-1.18-.422-1.985-1.478-1.985-.806 0-1.286.543-1.497 1.067-.077.187-.096.45-.096.712v4.902Z"
      clipRule="evenodd"
    />
  </svg>
);

export default LinkedIn;
