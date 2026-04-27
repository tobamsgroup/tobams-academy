"use client";

import { useState } from "react";
import Image from "next/image";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import EditProfileModal from "./EditProfileModal";
import EditSocialLinksModal, { type SocialLinkData } from "./EditSocialLinksModal";
import ProfileSuccessModal from "./ProfileSuccessModal";
import ProfileErrorModal from "./ProfileErrorModal";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  url: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const defaultProfile: ProfileData = {
  name: "Matthew Murray",
  email: "matthewmurray@test.com",
  phone: "+234 800 100 2000",
  bio: "I'm really passionate about science, technology, and how things work. I love solving problems, building projects, and learning new design skills. I enjoy sharing ideas in class forums and connecting with other students. Whether it's a group task or solo challenge, I always try to give it my best. Outside class, I like exploring web design and experimenting with coding.",
  avatarUrl: IMAGES.profile.src,
  socialLinks: [
    { icon: <ICONS.ProfileLinkedIn width={16} height={16} />, label: "LinkedIn", url: "linkedin.com/matthewmurray" },
    { icon: <ICONS.ProfileFacebook width={16} height={16} />, label: "Facebook", url: "facebook.com/matthewmurray" },
    { icon: <ICONS.ProfileInstagram width={16} height={16} />, label: "Instagram", url: "instagram.com/matthewmurray" },
    { icon: <ICONS.ProfileTwitter width={16} height={16} />, label: "X", url: "x.com/matthewmurray" },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 font-medium text-heading hover:text-gray-900 border border-[#D3D2D366] rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
    >
      <ICONS.ProfilePenIcon width={14} height={14} />
      Edit
    </button>
  );
}

function ProfileHeader({ profile, onEdit }: { profile: ProfileData; onEdit: () => void }) {
  return (
    <div className="rounded-2xl bg-white">
      {/* Banner */}
      <div className="h-[156px] bg-gradient-to-br from-[#3d4f8c] via-[#4a5fa8] to-[#5b6abf] md:rounded-t-2xl relative overflow-hidden">
        <Image
          src={IMAGES.wave}
          alt=""
          fill
          className="object-cover object-bottom opacity-20"
        />
      </div>

      {/* Avatar + Info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar — mobile: centered, desktop: left */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 ring-4 ring-white rounded-full shadow-md">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={175}
            height={175}
            className="rounded-full object-cover md:w-[175px] md:h-[175px] w-[95px] h-[95px]"
          />
        </div>

        {/* Mobile layout: centered stack */}
        <div className="flex flex-col items-center gap-3 pt-14 md:hidden">
          <div className="text-center">
            <h2 className="font-semibold text-heading text-[20px]">{profile.name}</h2>
            <div className="mt-1.5 flex flex-col items-center gap-1 text-body text-sm">
              <span className="flex items-center gap-2">
                <ICONS.ProfileMail />
                {profile.email}
              </span>
              <span className="flex items-center gap-2">
                <ICONS.ProfilePhone />
                {profile.phone}
              </span>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-1.5 font-medium text-heading border border-[#D3D2D366] rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <ICONS.ProfilePenIcon width={14} height={14} />
            Edit
          </button>
        </div>

        {/* Desktop layout: side-by-side row */}
        <div className="hidden md:flex items-center justify-between pt-4 ml-[100px]">
          <div className="flex items-center gap-4">
            <div className="w-[88px] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-heading text-[20px]">{profile.name}</h2>
              <div className="mt-1 flex flex-col gap-1 text-body">
                <span className="flex items-center gap-2">
                  <ICONS.ProfileMail />
                  {profile.email}
                </span>
                <span className="flex items-center gap-2">
                  <ICONS.ProfilePhone />
                  {profile.phone}
                </span>
              </div>
            </div>
          </div>
          <EditButton onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}

function BioCard({ bio }: { bio: string }) {
  return (
    <div className="rounded-[12px] bg-white border border-[#D3D2D366] px-6 py-5">
      <h3 className="font-semibold text-heading text-lg mb-3">Bio</h3>
      <p className="text-body leading-relaxed">{bio}</p>
    </div>
  );
}

function SocialLinksCard({ links, onEdit }: { links: SocialLink[]; onEdit: () => void }) {
  return (
    <div className="rounded-[12px] bg-white border border-[#D3D2D366] px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-heading text-lg">Social Links</h3>
        <EditButton onClick={onEdit} />
      </div>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={`https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#D3D2D31A] hover:bg-gray-100 transition-colors=text-heading"
            >
              <span className="text-gray-500">{link.icon}</span>
              {link.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileSection() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [socialEditOpen, setSocialEditOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  function handleProfileSave(updated: Partial<ProfileData>) {
    try {
      setProfile((prev) => ({ ...prev, ...updated }));
      setErrorOpen(true);
    } catch {
      setErrorOpen(true);
    }
  }

  function handleSocialSave(updated: SocialLinkData[]) {
    try {
      setProfile((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((link, i) => ({
          ...link,
          url: updated[i]?.url ?? link.url,
        })),
      }));
      setErrorOpen(true);
    } catch {
      setErrorOpen(true);
    }
  }

  const socialLinkData: SocialLinkData[] = profile.socialLinks.map((link) => ({
    label: link.label,
    url: link.url,
    placeholder: `${link.label.toLowerCase()}.com/`,
  }));

  return (
    <>
      <div className="w-full flex items-start justify-center">
        <div className="w-full max-w-[1104px] flex flex-col gap-8 border border-[#D3D2D366] rounded-[12px]">
          <ProfileHeader profile={profile} onEdit={() => setProfileEditOpen(true)} />
          <div className="md:px-8 px-6 pb-8 flex flex-col gap-4">
            <BioCard bio={profile.bio} />
            <SocialLinksCard links={profile.socialLinks} onEdit={() => setSocialEditOpen(true)} />
          </div>
        </div>
      </div>

      {profileEditOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setProfileEditOpen(false)}
          onSave={handleProfileSave}
        />
      )}

      {socialEditOpen && (
        <EditSocialLinksModal
          links={socialLinkData}
          onClose={() => setSocialEditOpen(false)}
          onSave={handleSocialSave}
        />
      )}

      <ProfileSuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

      <ProfileErrorModal
        isOpen={errorOpen}
        onCancel={() => setErrorOpen(false)}
        onTryAgain={() => setErrorOpen(false)}
      />
    </>
  );
}
