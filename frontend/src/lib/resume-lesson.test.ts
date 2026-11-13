import { resumeLessonId } from "./resume-lesson";

const lessons = ["l1", "l2", "l3", "l4"];

describe("resumeLessonId", () => {
  it("starts at the first lesson when nothing has been opened or completed", () => {
    expect(resumeLessonId(lessons, new Set())).toBe("l1");
  });

  it("returns to the lesson the learner last had open if it isn't finished", () => {
    expect(resumeLessonId(lessons, new Set(["l1"]), "l3")).toBe("l3");
  });

  it("moves on to the next unfinished lesson after a completed last lesson", () => {
    expect(resumeLessonId(lessons, new Set(["l2"]), "l2")).toBe("l3");
    expect(resumeLessonId(lessons, new Set(["l2", "l3"]), "l2")).toBe("l4");
  });

  it("wraps back to an earlier unfinished lesson when everything after is done", () => {
    expect(resumeLessonId(lessons, new Set(["l2", "l3", "l4"]), "l4")).toBe("l1");
  });

  it("stays on the last opened lesson when the whole course is complete", () => {
    expect(resumeLessonId(lessons, new Set(lessons), "l3")).toBe("l3");
  });

  it("ignores a last lesson that no longer belongs to the course", () => {
    expect(resumeLessonId(lessons, new Set(["l1"]), "gone")).toBe("l2");
  });

  it("handles an empty course", () => {
    expect(resumeLessonId([], new Set())).toBeUndefined();
  });
});
