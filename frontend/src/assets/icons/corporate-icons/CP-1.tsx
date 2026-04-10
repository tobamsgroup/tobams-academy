import { Iconprops } from "@/types";
import React, { FC } from "react";

const CP1: FC<Iconprops> = (props) => {
  const w = props?.width ?? 64;
  const h = props?.height ?? 64;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 64 64"
      fill="none"
      className={props?.className}
      onClick={props?.onClick}
    >
      <rect width={64} height={64} fill="#1671D9" fillOpacity={0.1} rx={8} />
      <path
        fill={props?.color ?? "#208EFF"}
        d="M53 44h-1.5V18.5a3 3 0 0 0-3-3h-33a3 3 0 0 0-3 3V44H11a1.5 1.5 0 1 0 0 3h42a1.5 1.5 0 1 0 0-3ZM15.5 18.5h33V44h-3v-4.5A1.5 1.5 0 0 0 44 38H30.5a1.5 1.5 0 0 0-1.5 1.5V44h-7.5V24.5h21v9a1.5 1.5 0 1 0 3 0V23a1.5 1.5 0 0 0-1.5-1.5H20a1.5 1.5 0 0 0-1.5 1.5v21h-3V18.5Zm27 25.5H32v-3h10.5v3Z"
      />
    </svg>
  );
};

export default CP1;
