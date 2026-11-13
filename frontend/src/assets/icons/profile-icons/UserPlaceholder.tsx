import { Iconprops } from '@/types'
import { FC } from 'react'

const ProfileUserPlaceholder: FC<Iconprops> = (props) => (
  <svg
    width={props?.width ?? 56}
    height={props?.height ?? 56}
    viewBox="0 0 24 24"
    fill={props?.color ?? 'currentColor'}
    className={props?.className ?? 'text-gray-400'}
    onClick={props?.onClick}
    aria-hidden
  >
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    <path d="M3 21c0-4 4-7 9-7s9 3 9 7" />
  </svg>
)

export default ProfileUserPlaceholder
