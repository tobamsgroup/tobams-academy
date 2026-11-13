import * as React from "react"
const EyeFill = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#696969"
      d="M9.281 12a2.625 2.625 0 1 0 5.25 0 2.625 2.625 0 0 0-5.25 0Zm12.802-.605C19.86 6.715 16.503 4.36 12 4.36c-4.505 0-7.861 2.356-10.083 7.039a1.413 1.413 0 0 0 0 1.207C4.14 17.285 7.497 19.64 12 19.64c4.505 0 7.86-2.356 10.083-7.039.18-.38.18-.82 0-1.207Zm-10.177 4.73a4.125 4.125 0 1 1 0-8.25 4.125 4.125 0 0 1 0 8.25Z"
    />
  </svg>
)
export default EyeFill
