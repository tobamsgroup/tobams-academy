"use client";

import { useState } from "react";
import { ICONS } from "@/assets/icons";
import type { PasswordInputProps } from "@/types/settings";

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  showToggle = true,
  className = "mb-4",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle && visible ? "text" : "password";

  return (
    <div className={className}>
      {label ? <label className="mb-1.5 block text-heading">{label}</label> : null}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={label ?? "Password"}
          className="w-full rounded-md border border-[#E4E4E4] px-4 py-2.5 pr-10 text-[14px] text-[#262626] outline-none transition-colors focus:border-[#1e2d5a]"
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#737373]"
          >
            <ICONS.SettingsEyeIcon visible={visible} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
