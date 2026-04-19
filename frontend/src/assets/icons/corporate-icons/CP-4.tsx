import { Iconprops } from "@/types";
import React, { FC } from "react";

const CP4: FC<Iconprops> = (props) => {
  const w = props?.width ?? 64;
  const h = props?.height ?? 64;
  const accent = props?.color || "#FAAF3A";
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
        d="M52.846 25.072A2.953 2.953 0 0 0 50 23H38.562L34.856 11.61a2.987 2.987 0 0 0-5.71-.01L25.45 23h-11.45a3 3 0 0 0-1.756 5.437l9.274 6.672-3.551 10.953a2.953 2.953 0 0 0 1.096 3.353 2.952 2.952 0 0 0 3.52 0L32 42.64l9.418 6.774a3 3 0 0 0 4.616-3.353l-3.562-10.96 9.28-6.678a2.95 2.95 0 0 0 1.094-3.352ZM32 12.528 35.397 23h-6.795L32 12.528ZM14 26h10.476l-1.982 6.105L14 26Zm6.814 21 3.26-10.048 5.352 3.851L20.814 47Zm4.232-13.044L27.629 26h8.742l2.578 7.946-6.95 4.991-6.953-4.981ZM43.175 47l-8.606-6.188 5.35-3.85L43.176 47ZM41.5 32.116 39.524 26H50l-8.5 6.116Z"
      />
    </svg>
  );
};

export default CP4;
