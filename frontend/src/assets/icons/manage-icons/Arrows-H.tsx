import * as React from "react"
const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#221D23"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m18 15 3-3-3-3m3 3h-6m-9 3-3-3 3-3m-3 3h6"
    />
  </svg>
)
export default SvgComponent
