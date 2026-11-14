import { useSession } from "next-auth/react";
import useSWR from "swr";
import type { PlayerLesson } from "../curriculum";

async function fetchDocument(lessonId: string, token: string): Promise<ArrayBuffer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/document`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(res.status === 403 ? "not-enrolled" : "failed");
  return res.arrayBuffer();
}

/**
 * Bytes of the PDF behind a reading/slides lesson (served only to enrolled learners).
 * Cached per document, so a week's PDF downloads once for all the lessons that use it.
 */
export function useLessonDocument(lesson: PlayerLesson) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  return useSWR(
    token && lesson.contentKey ? ["lesson-document", lesson.contentKey] : null,
    () => fetchDocument(lesson.id, token as string),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
}
