import { Iconprops } from "@/types";
import React, { FC } from "react";

const Progress: FC<Iconprops> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || 24}
    height={props?.height || 24}
    fill="none"
    {...props}
  >
    <path
      stroke={props?.stroke || "#303869"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 20.777a8.943 8.943 0 0 1-2.48-.97M14 3.224a9.003 9.003 0 0 1 0 17.554m-9.421-3.684A8.963 8.963 0 0 1 3.352 14.5M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A8.954 8.954 0 0 1 10 3.223M9 12l2 2 4-4"
    />
  </svg>
)
export default Progress
