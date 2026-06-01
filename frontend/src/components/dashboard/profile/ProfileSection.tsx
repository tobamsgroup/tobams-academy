"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import EditProfileModal from "./EditProfileModal";
import EditSocialLinksModal from "./EditSocialLinksModal";
import ProfileSuccessModal from "./ProfileSuccessModal";
import ProfileErrorModal from "./ProfileErrorModal";
import { useProfile } from "@/hooks/useProfile";
import type {
  BioCardProps,
  EditProfileData,
  ProfileHeaderProps,
  ProfileViewData,
  SocialLinkData,
  SocialLinksCardProps,
  UpdateProfilePayload,
  UpdateSocialLinksPayload,
} from "@/types/profile";

const FALLBACK_BIO = "Tell us a little about yourself.";
const FALLBACK_PHONE = "Add a phone number";

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

function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl bg-white">
      <div className="h-[156px] bg-gradient-to-br from-[#3d4f8c] via-[#4a5fa8] to-[#5b6abf] md:rounded-t-2xl relative overflow-hidden">
        <Image
          src={IMAGES.wave}
          alt=""
          fill
          className="object-cover object-bottom opacity-20"
        />
      </div>

      <div className="px-6 pb-6 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 ring-4 ring-white rounded-full shadow-md">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={175}
            height={175}
            className="rounded-full object-cover md:w-[175px] md:h-[175px] w-[95px] h-[95px]"
            unoptimized={profile.avatarUrl.startsWith("blob:")}
          />
        </div>

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

function BioCard({ bio }: BioCardProps) {
  return (
    <div className="rounded-[12px] bg-white border border-[#D3D2D366] px-6 py-5">
      <h3 className="font-semibold text-heading text-lg mb-3">Bio</h3>
      <p className="text-body leading-relaxed">{bio}</p>
    </div>
  );
}

function SocialLinksCard({ links, onEdit }: SocialLinksCardProps) {
  const visible = links.filter((l) => Boolean(l.url));
  return (
    <div className="rounded-[12px] bg-white border border-[#D3D2D366] px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-heading text-lg">Social Links</h3>
        <EditButton onClick={onEdit} />
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-body">No social links yet. Click Edit to add some.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((link) => (
            <li key={link.field}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#D3D2D31A] hover:bg-gray-100 transition-colors text-heading"
              >
                <span className="text-gray-500">{link.icon}</span>
                {link.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function nullableTrim(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileSection() {
  const { profile: apiProfile, isLoading, error, updateProfile, updateSocialLinks } = useProfile();

  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [socialEditOpen, setSocialEditOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const view = useMemo<ProfileViewData | null>(() => {
    if (!apiProfile) return null;
    return {
      name: apiProfile.name,
      email: apiProfile.email,
      phone: apiProfile.phone ?? FALLBACK_PHONE,
      bio: apiProfile.bio ?? FALLBACK_BIO,
      avatarUrl: apiProfile.avatarUrl ?? IMAGES.profile.src,
      socialLinks: [
        {
          icon: <ICONS.ProfileLinkedIn width={16} height={16} />,
          label: "LinkedIn",
          field: "linkedinUrl",
          url: apiProfile.linkedinUrl ?? "",
        },
        {
          icon: <ICONS.ProfileFacebook width={16} height={16} />,
          label: "Facebook",
          field: "facebookUrl",
          url: apiProfile.facebookUrl ?? "",
        },
        {
          icon: <ICONS.ProfileInstagram width={16} height={16} />,
          label: "Instagram",
          field: "instagramUrl",
          url: apiProfile.instagramUrl ?? "",
        },
        {
          icon: <ICONS.ProfileTwitter width={16} height={16} />,
          label: "X",
          field: "xUrl",
          url: apiProfile.xUrl ?? "",
        },
      ],
    };
  }, [apiProfile]);

  const editModalProfile = useMemo(() => {
    if (!apiProfile) return null;
    return {
      name: apiProfile.name,
      email: apiProfile.email,
      phone: apiProfile.phone ?? "",
      bio: apiProfile.bio ?? "",
      avatarUrl: apiProfile.avatarUrl ?? IMAGES.profile.src,
    };
  }, [apiProfile]);

  const socialLinkData: SocialLinkData[] = useMemo(() => {
    if (!view) return [];
    return view.socialLinks.map((l) => ({
      label: l.label,
      url: l.url,
      placeholder: `${l.label.toLowerCase()}.com/`,
    }));
  }, [view]);

  async function handleProfileSave(updated: Partial<EditProfileData>) {
    try {
      const payload: UpdateProfilePayload = {};
      if (updated.name !== undefined) payload.name = updated.name.trim();
      if (updated.phone !== undefined) payload.phone = nullableTrim(updated.phone ?? "");
      if (updated.bio !== undefined) payload.bio = nullableTrim(updated.bio ?? "");
      if (updated.avatarUrl !== undefined) {
        const url = updated.avatarUrl ?? "";
        payload.avatarUrl = url.startsWith("blob:") ? undefined : nullableTrim(url);
      }

      await updateProfile(payload);
      setSuccessOpen(true);
    } catch (e) {
      setErrorMessage(extractApiError(e));
      setErrorOpen(true);
    }
  }

  async function handleSocialSave(updated: SocialLinkData[]) {
    if (!view) return;
    try {
      const payload: UpdateSocialLinksPayload = {};
      view.socialLinks.forEach((link, i) => {
        const next = updated[i]?.url ?? "";
        payload[link.field] = nullableTrim(next);
      });

      await updateSocialLinks(payload);
      setSuccessOpen(true);
    } catch (e) {
      setErrorMessage(extractApiError(e));
      setErrorOpen(true);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-body">Loading profile…</div>
    );
  }

  if (error || !view || !editModalProfile) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-body">
        Could not load your profile. Please refresh and try again.
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex items-start justify-center">
        <div className="w-full max-w-[1104px] flex flex-col gap-8 border border-[#D3D2D366] rounded-[12px]">
          <ProfileHeader profile={view} onEdit={() => setProfileEditOpen(true)} />
          <div className="md:px-8 px-6 pb-8 flex flex-col gap-4">
            <BioCard bio={view.bio} />
            <SocialLinksCard links={view.socialLinks} onEdit={() => setSocialEditOpen(true)} />
          </div>
        </div>
      </div>

      {profileEditOpen && (
        <EditProfileModal
          profile={editModalProfile}
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

      <ProfileSuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />

      <ProfileErrorModal
        isOpen={errorOpen}
        message={errorMessage}
        onCancel={() => setErrorOpen(false)}
        onTryAgain={() => setErrorOpen(false)}
      />
    </>
  );
}

function extractApiError(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message;
  }
  return undefined;
}
