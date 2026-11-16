import { useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'

export type LearnerCertificate = {
  id: string
  certificateNumber: string
  courseId: string
  courseSlug: string
  courseTitle: string
  learnerName: string
  issuedAt: string
  verifyUrl: string
}

/** The signed-in learner's certificates, plus a helper to download one as a PDF. */
export function useCertificates() {
  const { data: session, status } = useSession()
  const token = session?.accessToken
  const { data, error, isLoading, mutate } = useSWR<LearnerCertificate[]>(
    status === 'authenticated' && token ? '/certificates' : null,
    createFetcher(token),
  )

  const byCourseId = useMemo(
    () => new Map((data ?? []).map((cert) => [cert.courseId, cert])),
    [data],
  )

  const download = useCallback(
    async (cert: LearnerCertificate) => {
      if (!token) return
      const res = await createAuthedClient(token).get<Blob>(`/certificates/${cert.id}/pdf`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `Certificate-${cert.courseTitle.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    },
    [token],
  )

  return { certificates: data ?? [], byCourseId, download, error, isLoading, mutate }
}
