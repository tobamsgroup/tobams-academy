import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    quiz: {
      findUnique: jest.fn(),
    },

    quizAttempt: {
      count: jest.fn(),
      create: jest.fn(),
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

  quizAttempt: {
    count: jest.Mock;
    create: jest.Mock;
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
  attemptsAllowed: 2,
  passingScore: 70,
  questions: [
    {
      id: "q1_1",
      text: "What is 2 + 2?",
      options: [
        {
          id: "o1",
          text: "3",
          isCorrect: false,
        },

        {
          id: "o2",
          text: "4",
          isCorrect: true,
        },

        {
          id: "o3",
          text: "5",
          isCorrect: false,
        },
      ],
    },
  ],
};

const createRequest = (body?: object) => {
  return new NextRequest("http://localhost/api/v1/quizzes/q1/attempts", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("POST /api/v1/quizzes/[quizId]/attempts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create quiz attempt successfully and calculate score", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.quiz.findUnique.mockResolvedValue(mockQuiz);
    mockPrisma.quizAttempt.count.mockResolvedValue(0);
    mockPrisma.quizAttempt.create.mockResolvedValue({
      id: "attempt1",
    });

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o2",
        },
      }),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.score).toBe(100);

    expect(body.data.isPassed).toBe(true);

    expect(body.data.correctAnswers).toEqual({
      q1_1: "o2",
    });

    expect(mockPrisma.quizAttempt.create).toHaveBeenCalledWith({
      data: {
        quizId: "q1",
        userId: "u1",
        score: 100,
        isPassed: true,
        answers: {
          q1_1: "o2",
        },
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o2",
        },
      }),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    expect(response.status).toBe(401);
  });

  it("should return 400 if quizId is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o2",
        },
      }),

      {
        params: Promise.resolve({}),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("quizId is required");
  });

  it("should return 400 if answers are missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("answers is required");
  });

  it("should return 404 if quiz is not found", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.quiz.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o2",
        },
      }),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.message).toBe("Quiz not found");
  });

  it("should return 429 if maximum attempts reached", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.quiz.findUnique.mockResolvedValue(mockQuiz);

    mockPrisma.quizAttempt.count.mockResolvedValue(2);

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o2",
        },
      }),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(429);

    expect(body.message).toBe("Maximum attempts (2) reached");

    expect(mockPrisma.quizAttempt.count).toHaveBeenCalledWith({
      where: {
        quizId: "q1",

        userId: "u1",
      },
    });
  });

  it("should calculate failed quiz score correctly", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.quiz.findUnique.mockResolvedValue(mockQuiz);

    mockPrisma.quizAttempt.count.mockResolvedValue(0);

    mockPrisma.quizAttempt.create.mockResolvedValue({
      id: "attempt1",
    });

    const response = await POST(
      createRequest({
        answers: {
          q1_1: "o1",
        },
      }),

      {
        params: Promise.resolve({
          quizId: "q1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.score).toBe(0);

    expect(body.data.isPassed).toBe(false);
  });
});
