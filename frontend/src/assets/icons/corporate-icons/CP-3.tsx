import { Iconprops } from "@/types";
import React, { FC } from "react";

const CP3: FC<Iconprops> = (props) => {
  const w = props?.width ?? 64;
  const h = props?.height ?? 64;
  const accent = props?.color || "#21B573";
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
      <rect width={64} height={64} fill={accent} fillOpacity={0.2} rx={8} />
      <path
        fill={accent}
        d="M41.75 35.375h-4.125v-6.75h4.125a6.375 6.375 0 1 0-6.375-6.375v4.125h-6.75V22.25a6.375 6.375 0 1 0-6.375 6.375h4.125v6.75H22.25a6.375 6.375 0 1 0 6.375 6.375v-4.125h6.75v4.125a6.375 6.375 0 1 0 6.375-6.375ZM37.625 22.25a4.125 4.125 0 1 1 4.125 4.125h-4.125V22.25Zm-19.5 0a4.125 4.125 0 0 1 8.25 0v4.125H22.25a4.125 4.125 0 0 1-4.125-4.125Zm8.25 19.5a4.124 4.124 0 1 1-4.125-4.125h4.125v4.125Zm2.25-13.125h6.75v6.75h-6.75v-6.75Zm13.125 17.25a4.125 4.125 0 0 1-4.125-4.125v-4.125h4.125a4.125 4.125 0 0 1 0 8.25Z"
      />
    </svg>
  );
};

export default CP3;
