import { Iconprops } from '@/types'
import { FC } from 'react'

const ProfileClose: FC<Iconprops> = (props) => (
  <svg
    width={props?.width ?? 18}
    height={props?.height ?? 18}
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
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export default ProfileClose
