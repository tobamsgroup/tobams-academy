import { GET, POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";
import { notify } from "@/lib/notifications";
import { recordLessonCompletion } from "@/lib/lesson-completion";

jest.mock("@/lib/week-locks", () => ({
  LOCKED_LESSON_MESSAGE: "Pass the previous week's quiz to unlock this week.",
  isLessonLocked: jest.fn().mockResolvedValue(false),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    lesson: { findUnique: jest.fn() },
    enrollment: { findUnique: jest.fn() },
    assignmentSubmission: { findUnique: jest.fn(), upsert: jest.fn() },
  },
}));
jest.mock("@/lib/notifications", () => ({ notify: jest.fn() }));
jest.mock("@/lib/with-auth", () => ({ getAuthUser: jest.fn() }));
jest.mock("@/lib/lesson-completion", () => ({ recordLessonCompletion: jest.fn() }));

const db = prisma as unknown as {
  lesson: { findUnique: jest.Mock };
  enrollment: { findUnique: jest.Mock };
  assignmentSubmission: { findUnique: jest.Mock; upsert: jest.Mock };
};
const mockAuth = getAuthUser as jest.Mock;
const mockComplete = recordLessonCompletion as jest.Mock;

const params = { params: Promise.resolve({ lessonId: "l1" }) };
const assignmentLesson = {
  id: "l1",
  title: "Week 1 Assignment",
  kind: "ASSIGNMENT",
  module: { courseId: "c1", course: { title: "Time Intelligence" } },
};
const enrollment = { id: "e1", completedAt: null, expiresAt: null };
const submittedAt = new Date("2026-11-16T10:00:00Z");

function uploadRequest(file?: File) {
  const form = new FormData();
  if (file) form.append("file", file);
  return new NextRequest("http://localhost/api/v1/lessons/l1/submission", { method: "POST", body: form });
}

describe("/lessons/[lessonId]/submission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockReturnValue({ id: "u1", email: "a@b.com", role: "LEARNER" });
    db.lesson.findUnique.mockResolvedValue(assignmentLesson);
    db.enrollment.findUnique.mockResolvedValue(enrollment);
  });

  it("GET returns null before anything is submitted", async () => {
    db.assignmentSubmission.findUnique.mockResolvedValue(null);
    const res = await GET(new NextRequest("http://localhost/api/v1/lessons/l1/submission"), params);
    expect(res.status).toBe(200);
    expect((await res.json()).data).toEqual({ submission: null });
  });

  it("POST stores the file and completes the lesson", async () => {
    db.assignmentSubmission.findUnique.mockResolvedValue(null);
    db.assignmentSubmission.upsert.mockResolvedValue({
      id: "s1",
      fileName: "my work.pdf",
      mimeType: "application/pdf",
      size: 5,
      submittedAt,
      updatedAt: submittedAt,
    });
    mockComplete.mockResolvedValue({ lessonId: "l1", completedAt: submittedAt.toISOString(), progress: 10 });

    const res = await POST(uploadRequest(new File(["%PDF-"], "my work.pdf", { type: "application/pdf" })), params);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.submission).toMatchObject({ id: "s1", fileName: "my work.pdf" });
    expect(body.data.lessonId).toBe("l1");
    const upsert = db.assignmentSubmission.upsert.mock.calls[0][0];
    expect(upsert.create).toMatchObject({ enrollmentId: "e1", lessonId: "l1", mimeType: "application/pdf", size: 5 });
    expect(mockComplete).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", courseId: "c1", lessonId: "l1" }),
    );
    expect(notify).toHaveBeenCalledWith("u1", expect.objectContaining({ title: "Assignment submitted" }));
  });

  it("POST rejects unsupported file types without completing", async () => {
    const res = await POST(uploadRequest(new File(["x"], "virus.exe")), params);
    expect(res.status).toBe(415);
    expect(db.assignmentSubmission.upsert).not.toHaveBeenCalled();
    expect(mockComplete).not.toHaveBeenCalled();
  });

  it("POST requires a file", async () => {
    const res = await POST(uploadRequest(), params);
    expect(res.status).toBe(400);
  });

  it("returns 404 for lessons that aren't assignments", async () => {
    db.lesson.findUnique.mockResolvedValue({ ...assignmentLesson, kind: "PDF" });
    const res = await POST(uploadRequest(new File(["x"], "a.pdf")), params);
    expect(res.status).toBe(404);
  });

  it("returns 403 when access has expired", async () => {
    db.enrollment.findUnique.mockResolvedValue({ ...enrollment, expiresAt: new Date("2020-01-01") });
    const res = await POST(uploadRequest(new File(["x"], "a.pdf")), params);
    expect(res.status).toBe(403);
  });

  it("returns 401 when signed out", async () => {
    mockAuth.mockReturnValue(null);
    const res = await GET(new NextRequest("http://localhost/api/v1/lessons/l1/submission"), params);
    expect(res.status).toBe(401);
  });
});
