"use client";

import ActivateTwoFactorModal from "@/components/dashboard/settings/ActivateTwoFactorModal";
import DeactivateAccountModal from "@/components/dashboard/settings/DeactivateAccountModal";
import PasswordInput from "@/components/dashboard/settings/PasswordInput";
import ProfileSuccessModal from "@/components/dashboard/profile/ProfileSuccessModal";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";

export default function SecuritySettings() {
  const { twoFactorEnabled, password, twoFactor, deactivate } = useSecuritySettings();

  return (
    <div>
      <h1 className="mb-5 text-[18px] md:text-[20px] font-semibold text-heading">Security</h1>

      <div className="mb-4 rounded-[12px] border border-[#D3D2D366] bg-white py-8 px-6">
        <h2 className="mb-5 border-b border-[#D3D2D366] pb-4 text-[17px] md:text-[18px] font-medium text-heading">Change Password</h2>

        {password.error ? (
          <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{password.error}</div>
        ) : null}
        {password.success ? (
          <div className="mb-4 rounded-lg bg-[#DBEFDC] p-3 text-sm text-[#099137]">{password.success}</div>
        ) : null}

        <PasswordInput label="Current Password" value={password.form.current} onChange={password.updateField("current")} showToggle={false} />
        <PasswordInput label="New Password" value={password.form.newPass} onChange={password.updateField("newPass")} />
        <PasswordInput label="Confirm Password" value={password.form.confirm} onChange={password.updateField("confirm")} />

        <div className="mt-2 flex flex-col-reverse md:flex-row justify-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={password.reset}
            disabled={password.loading}
            className="rounded-lg bg-[#D3D2D333] px-6 py-3 font-medium text-heading transition-colors hover:bg-gray-50 w-full md:w-auto disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={password.save}
            disabled={password.loading}
            className="rounded-lg bg-primary px-6 py-3 text-heading font-medium text-white transition-colors hover:bg-[#16234a] w-full md:w-auto disabled:opacity-60"
          >
            {password.loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[12px] border border-[#D3D2D366] bg-white py-8 px-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="mb-2 md:text-[20px] text-[18px] font-medium text-heading">Two Factor Authentication</h2>
            <p className="text-base leading-relaxed text-[#6C686C]">
              Turn on Two-Factor Authentication (2FA) to add an extra level of security to your account.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactorEnabled}
            onClick={twoFactor.openModal}
            className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              twoFactorEnabled ? "bg-[#1e2d5a]" : "bg-[#D4D4D4]"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                twoFactorEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <ActivateTwoFactorModal
        isOpen={twoFactor.modalOpen}
        enable={twoFactor.pendingEnable}
        loading={twoFactor.loading}
        error={twoFactor.error}
        onClose={twoFactor.closeModal}
        onConfirm={twoFactor.confirm}
      />

      <ProfileSuccessModal
        isOpen={twoFactor.successOpen}
        onClose={twoFactor.closeSuccess}
        title="Two-Factor Authentication Activated"
        message="Two-Factor Authentication has been successfully set up for your account, ensuring an added layer of security."
      />

      <DeactivateAccountModal
        isOpen={deactivate.modalOpen}
        loading={deactivate.loading}
        error={deactivate.error}
        onClose={deactivate.closeModal}
        onConfirm={deactivate.confirm}
      />

      <ProfileSuccessModal
        isOpen={deactivate.successOpen}
        onClose={deactivate.closeSuccess}
        title="Account Deactivated"
        message="Your account has been successfully deactivated. You will be signed out and redirected to the homepage."
      />

      <div className="text-center">
        <button
          type="button"
          onClick={deactivate.openModal}
          className="md:text-lg text-[#DE2121] hover:underline"
        >
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
