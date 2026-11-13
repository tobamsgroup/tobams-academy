import type { SVGProps } from "react"

const StarsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={80}
    viewBox="0 0 80 80"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M0 40c25.425 0 40-14.575 40-40 0 25.425 14.575 40 40 40-25.425 0-40 14.575-40 40 0-25.425-14.575-40-40-40Z"
      clipRule="evenodd"
    />
    <path
      fill="#FEC84B"
      fillRule="evenodd"
      d="M0 12c7.627 0 12-4.373 12-12 0 7.627 4.373 12 12 12-7.627 0-12 4.373-12 12 0-7.627-4.373-12-12-12ZM64 24c5.085 0 8-2.915 8-8 0 5.085 2.915 8 8 8-5.085 0-8 2.915-8 8 0-5.085-2.915-8-8-8Z"
      clipRule="evenodd"
    />
  </svg>
)
export default StarsIcon
