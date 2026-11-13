import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    quiz: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  quiz: {
    findUnique: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const mockQuiz = {
  id: "q1",
  lessonId: "l1",
  timeLimit: 30,
  passingScore: 70,
  attemptsAllowed: 3,
  questionType: "MULTIPLE_CHOICE",

  questions: [
    {
      id: "q1_1",
      text: "What is 2 + 2?",
      position: 1,
      options: [
        {
          id: "o1",
          text: "3",
          position: 1,
        },
        {
          id: "o2",
          text: "4",
          position: 2,
        },
      ],
    },
  ],
};

const createRequest = () => {
  return new NextRequest("http://localhost/api/v1/quizzes/lesson/l1", {
    method: "GET",
  });
};

describe("GET /api/v1/quizzes/lesson/[lessonId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the quiz data for an authenticated user with valid credentials", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.quiz.findUnique.mockResolvedValue(mockQuiz);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ lessonId: "l1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual(
      expect.objectContaining({
        id: "q1",
        totalQuestions: 1,
        questions: expect.arrayContaining([
          expect.objectContaining({
            id: "q1_1",
            text: "What is 2 + 2?",
            options: expect.arrayContaining([
              expect.objectContaining({ id: "o2", text: "4", position: 2 }),
            ]),
          }),
        ]),
      }),
    );
    expect(body.data.questions[0].options[0]).not.toHaveProperty("isCorrect");
    expect(mockPrisma.quiz.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          lessonId: "l1",
        },
      }),
    );
  });

  it("should return 401 if the user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ lessonId: "l1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });

  it("should return 400 if lessonId is not provided", async () => {
    mockAuth.mockReturnValue(user);

    const response = await GET(createRequest(), {
      params: Promise.resolve({}),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("lessonId is required");
  });

  it("should return 404 if the quiz is not found", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.quiz.findUnique.mockResolvedValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({ lessonId: "l1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Quiz not found");
  });
});
