"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const UserPlaceholderIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    <path d="M3 21c0-4 4-7 9-7s9 3 9 7" />
  </svg>
);

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EditProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
}

interface Props {
  profile: EditProfileData;
  onClose: () => void;
  onSave: (updated: Partial<EditProfileData>) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded border border-[#D3D2D3] bg-white px-2 py-2.5 text-heading placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

export default function EditProfileModal({ profile, onClose, onSave }: Props) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSave() {
    onSave({ name, email, phone, bio, avatarUrl: avatarPreview });
    onClose();
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-14 z-50 bg-[#FAFDFF] md:inset-0 md:flex md:items-center md:justify-center md:bg-black/40 md:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="h-full w-full flex flex-col md:h-auto md:max-w-[607px] md:rounded-lg md:max-h-[90vh] md:bg-[#FAFDFF]">

        {/* Mobile header: back arrow + stacked title */}
        <div className="md:hidden px-6 pt-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-heading" aria-label="Back">
            <BackArrowIcon />
          </button>
          <h2 className="text-[20px] font-semibold text-heading mt-2">Edit Profile</h2>
        </div>

        {/* Desktop header: title + close button inline */}
        <div className="hidden md:flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-[20px] font-semibold text-heading">Edit Profile</h2>
          <button
            onClick={onClose}
            className="flex h-12 w-12 font-semibold items-center justify-center rounded-full bg-[#D3D2D366] text-heading hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body + footer together */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 flex-1">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-6">
            <div className="h-[108px] w-[100px] rounded-full bg-gray-100 overflow-hidden flex items-center justify-center ring-2 ring-gray-200">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={100}
                  height={108}
                  className="h-full w-full object-cover"
                  unoptimized={avatarPreview.startsWith("blob:")}
                />
              ) : (
                <UserPlaceholderIcon />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-heading border border-[#D3D2D366] bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <UploadIcon />
              Change Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-heading">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-heading">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-heading">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-heading">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Tell us about yourself…"
              />
            </div>
          </div>

          {/* Footer: stacked on mobile (save on top), side-by-side on desktop */}
          <div className="flex flex-col-reverse gap-3 pt-2 pb-4 md:flex-row md:border-t md:border-gray-100 md:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-[#D3D2D333] py-3 font-medium text-heading hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary py-3 font-medium text-white hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
