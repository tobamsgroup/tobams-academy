import { Iconprops } from '@/types'
import { FC } from 'react'

const ProfileBackArrow: FC<Iconprops> = (props) => (
  <svg
    width={props?.width ?? 20}
    height={props?.height ?? 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props?.stroke ?? 'currentColor'}
    strokeWidth={props?.strokeWidth ?? '2'}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props?.className}
    onClick={props?.onClick}
    aria-hidden
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default ProfileBackArrow
