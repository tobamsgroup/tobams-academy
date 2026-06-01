import type { ReactNode } from 'react'

export type Role = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: Role
  emailVerified: boolean
  phone: string | null
  bio: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  xUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string | null
  bio?: string | null
  avatarUrl?: string | null
}

export interface UpdateSocialLinksPayload {
  linkedinUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  xUrl?: string | null
}

export interface EditProfileData {
  name: string
  email: string
  phone: string
  bio: string
  avatarUrl: string
}

export interface EditProfileModalProps {
  profile: EditProfileData
  onClose: () => void
  onSave: (updated: Partial<EditProfileData>) => void
}

export interface SocialLinkData {
  label: string
  url: string
  placeholder: string
}

export interface EditSocialLinksModalProps {
  links: SocialLinkData[]
  onClose: () => void
  onSave: (updated: SocialLinkData[]) => void
}

export interface ProfileSocialLink {
  icon: ReactNode
  label: string
  url: string
  field: keyof UpdateSocialLinksPayload
}

export interface ProfileViewData {
  name: string
  email: string
  phone: string
  bio: string
  avatarUrl: string
  socialLinks: ProfileSocialLink[]
}

export interface EditButtonProps {
  onClick?: () => void
}

export interface ProfileHeaderProps {
  profile: ProfileViewData
  onEdit: () => void
}

export interface BioCardProps {
  bio: string
}

export interface SocialLinksCardProps {
  links: ProfileSocialLink[]
  onEdit: () => void
}
