import type { ChangeEvent } from 'react'

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordForm {
  current: string
  newPass: string
  confirm: string
}

export interface EyeIconProps {
  visible: boolean
  width?: number
  height?: number
  className?: string
  stroke?: string
  strokeWidth?: string
}

export interface TwoFactorPayload {
  password: string
  enable: boolean
}

export interface ActivateTwoFactorModalProps {
  isOpen: boolean
  enable: boolean
  loading?: boolean
  error?: string
  onClose: () => void
  onConfirm: (password: string) => void | Promise<void>
}

export interface DeactivateAccountPayload {
  password: string
  reason: string
}

export interface DeactivateAccountModalProps {
  isOpen: boolean
  loading?: boolean
  error?: string
  onClose: () => void
  onConfirm: (payload: DeactivateAccountPayload) => void | Promise<void>
}

export type DeactivationReasonOption = 'inactivity' | 'other'

export const DEACTIVATION_REASON_INACTIVITY = 'Inactivity for a prolonged period.'

export interface PasswordInputProps {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  showToggle?: boolean
  className?: string
}
