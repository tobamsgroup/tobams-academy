"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/assets/icons";
import type { EditProfileModalProps } from "@/types/profile";

const inputClass =
  "w-full rounded border border-[#D3D2D3] bg-white px-2 py-2.5 text-heading placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
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
    onSave({ name, phone, bio, avatarUrl: avatarPreview });
    onClose();
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-14 z-50 bg-[#FAFDFF] md:inset-0 md:flex md:items-center md:justify-center md:bg-black/40 md:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="h-full w-full flex flex-col md:h-auto md:max-w-[607px] md:rounded-lg md:max-h-[90vh] md:bg-[#FAFDFF]">

        <div className="md:hidden px-6 pt-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-heading" aria-label="Back">
            <ICONS.ProfileBackArrow />
          </button>
          <h2 className="text-[20px] font-semibold text-heading mt-2">Edit Profile</h2>
        </div>

        <div className="hidden md:flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-[20px] font-semibold text-heading">Edit Profile</h2>
          <button
            onClick={onClose}
            className="flex h-12 w-12 font-semibold items-center justify-center rounded-full bg-[#D3D2D366] text-heading hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <ICONS.ProfileClose />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 flex-1">
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
                <ICONS.ProfileUserPlaceholder />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-heading border border-[#D3D2D366] bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <ICONS.ProfileUpload />
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
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                placeholder="your@email.com"
                readOnly
                aria-readonly="true"
              />
              <span className="text-xs text-gray-500">Email cannot be changed.</span>
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
