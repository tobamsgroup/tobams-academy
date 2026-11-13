import { ChangeEvent, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useProfile } from '@/hooks/useProfile'
import type { ChangePasswordForm, DeactivateAccountPayload } from '@/types/settings'

function extractApiError(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message
  }
  return undefined
}

export function useSecuritySettings() {
  const { profile, changePassword, updateTwoFactor, deactivateAccount } = useProfile()
  const twoFactorEnabled = profile?.twoFactorEnabled === true

  const [form, setForm] = useState<ChangePasswordForm>({ current: '', newPass: '', confirm: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const [tfaModalOpen, setTfaModalOpen] = useState(false)
  const [tfaPendingEnable, setTfaPendingEnable] = useState(true)
  const [tfaLoading, setTfaLoading] = useState(false)
  const [tfaError, setTfaError] = useState('')
  const [tfaSuccessOpen, setTfaSuccessOpen] = useState(false)

  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false)
  const [deactivateLoading, setDeactivateLoading] = useState(false)
  const [deactivateError, setDeactivateError] = useState('')
  const [deactivateSuccessOpen, setDeactivateSuccessOpen] = useState(false)

  const updatePasswordField = (key: keyof ChangePasswordForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setPasswordError('')
    setPasswordSuccess('')
  }

  const resetPasswordForm = () => {
    setForm({ current: '', newPass: '', confirm: '' })
    setPasswordError('')
    setPasswordSuccess('')
  }

  const savePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')

    if (!form.current || !form.newPass || !form.confirm) {
      setPasswordError('All password fields are required.')
      return
    }
    if (form.newPass.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (form.newPass !== form.confirm) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword({
        currentPassword: form.current,
        newPassword: form.newPass,
      })
      resetPasswordForm()
      setPasswordSuccess('Password changed successfully.')
    } catch (e) {
      setPasswordError(extractApiError(e) ?? 'Unable to change password. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const openTfaModal = () => {
    setTfaPendingEnable(!twoFactorEnabled)
    setTfaError('')
    setTfaModalOpen(true)
  }

  const closeTfaModal = () => {
    if (tfaLoading) return
    setTfaModalOpen(false)
    setTfaError('')
  }

  const confirmTfa = async (password: string) => {
    setTfaError('')
    setTfaLoading(true)
    try {
      await updateTwoFactor({ password, enable: tfaPendingEnable })
      setTfaModalOpen(false)
      if (tfaPendingEnable) setTfaSuccessOpen(true)
    } catch (e) {
      setTfaError(extractApiError(e) ?? 'Unable to update two-factor authentication. Please try again.')
    } finally {
      setTfaLoading(false)
    }
  }

  const openDeactivateModal = () => {
    setDeactivateError('')
    setDeactivateModalOpen(true)
  }

  const closeDeactivateModal = () => {
    if (deactivateLoading) return
    setDeactivateModalOpen(false)
    setDeactivateError('')
  }

  const confirmDeactivate = async (payload: DeactivateAccountPayload) => {
    setDeactivateError('')
    setDeactivateLoading(true)
    try {
      await deactivateAccount(payload)
      setDeactivateModalOpen(false)
      setDeactivateSuccessOpen(true)
    } catch (e) {
      setDeactivateError(extractApiError(e) ?? 'Unable to deactivate account. Please try again.')
    } finally {
      setDeactivateLoading(false)
    }
  }

  const closeDeactivateSuccess = () => {
    setDeactivateSuccessOpen(false)
    void signOut({ callbackUrl: '/' })
  }

  return {
    twoFactorEnabled,
    password: {
      form,
      loading: passwordLoading,
      error: passwordError,
      success: passwordSuccess,
      updateField: updatePasswordField,
      reset: resetPasswordForm,
      save: savePassword,
    },
    twoFactor: {
      modalOpen: tfaModalOpen,
      pendingEnable: tfaPendingEnable,
      loading: tfaLoading,
      error: tfaError,
      successOpen: tfaSuccessOpen,
      openModal: openTfaModal,
      closeModal: closeTfaModal,
      confirm: confirmTfa,
      closeSuccess: () => setTfaSuccessOpen(false),
    },
    deactivate: {
      modalOpen: deactivateModalOpen,
      loading: deactivateLoading,
      error: deactivateError,
      successOpen: deactivateSuccessOpen,
      openModal: openDeactivateModal,
      closeModal: closeDeactivateModal,
      confirm: confirmDeactivate,
      closeSuccess: closeDeactivateSuccess,
    },
  }
}
