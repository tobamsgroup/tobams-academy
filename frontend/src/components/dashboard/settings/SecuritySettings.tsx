"use client";

import { ChangeEvent, useState } from "react";

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showToggle?: boolean;
};

function PasswordInput({ label, value, onChange, placeholder, showToggle = true }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle && visible ? "text" : "password";

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-heading">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-md border border-[#E4E4E4] px-4 py-2.5 pr-10 text-[14px] text-[#262626] outline-none transition-colors focus:border-[#1e2d5a]"
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#737373]"
          >
            <EyeIcon visible={visible} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function SecuritySettings() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [tfa, setTfa] = useState(false);

  const updateField = (key: "current" | "newPass" | "confirm") => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  return (
    <div>
      <h1 className="mb-5 text-[18px] md:text-[20px] font-semibold text-heading">Security</h1>

      <div className="mb-4 rounded-[12px] border border-[#D3D2D366] bg-white py-8 px-6">
        <h2 className="mb-5 border-b border-[#D3D2D366] pb-4 text-[17px] md:text-[18px] font-medium text-heading">Change Password</h2>

        <PasswordInput label="Current Password" value={form.current} onChange={updateField("current")} showToggle={false} />
        <PasswordInput label="New Password" value={form.newPass} onChange={updateField("newPass")} />
        <PasswordInput label="Confirm Password" value={form.confirm} onChange={updateField("confirm")} />

        <div className="mt-2 flex flex-col-reverse md:flex-row justify-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setForm({ current: "", newPass: "", confirm: "" })}
            className="rounded-lg bg-[#D3D2D333] px-6 py-3 font-medium text-heading transition-colors hover:bg-gray-50 w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-3 text-heading font-medium text-white transition-colors hover:bg-[#16234a] w-full md:w-auto"
          >
            Save Changes
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
            aria-checked={tfa}
            onClick={() => setTfa((prev) => !prev)}
            className={`relative mt-1 h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
              tfa ? "bg-[#1e2d5a]" : "bg-[#D4D4D4]"
            }`}
          >
            <span
              className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ${
                tfa ? "translate-x-[23px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="text-center">
        <button type="button" className="md:text-lg text-[#DE2121] hover:underline">
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
