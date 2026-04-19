export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  label: string;
  items: FAQItem[];
};

export const faqData: FAQCategory[] = [
  {
    label: "General",
    items: [
      {
        question: "What is Tobams Group Academy?",
        answer:
          "Tobams Group Academy is an online learning platform that offers a wide range of courses to help individuals acquire new skills, enhance their knowledge, and achieve personal and professional growth.",
      },
      {
        question: "How do I enroll in a course?",
        answer:
          "To enroll in a course, simply browse our course catalog, select the desired course, and follow the enrollment instructions.",
      },
      {
        question: "Can I download course materials for offline access?",
        answer:
          "Course materials can typically be accessed online, but we encourage you to check specific course details for any offline access options.",
      },
      {
        question: "Can I access my courses on mobile devices?",
        answer:
          "Yes, our platform is mobile-friendly, allowing you to access courses on smartphones and tablets.",
      },
      {
        question: "How do I get started on Tobams Group Academy?",
        answer:
          "You can get started by exploring our available courses, selecting one that interests you, and enrolling to begin your learning journey.",
      },
      {
        question: "Are the courses self-paced?",
        answer:
          "Yes, our courses are self-paced, allowing you to learn at your convenience. For corporate training, we also offer a live, instructor-led (online face-to-face) model. You can contact us to learn more.",
      },
    ],
  },
  {
    label: "Certification",
    items: [
      {
        question: "Why is TGA certification important for learners?",
        answer:
          "TGA certification adds credibility to your skills and knowledge, making your qualifications widely recognized in the industry.",
      },
      {
        question: "Are the courses certified?",
        answer:
          "Yes, Tobams Group Academy offers courses that are certified.",
      },
      {
        question: "Can I verify the TGA certification of a course I completed on Tobams Group Academy?",
        answer:
          "Yes, you can verify the TGA certification by checking your course completion certificate, which will bear the official TGA certification seal.",
      },
    ],
  },
  {
    label: "Corporate Training",
    items: [
      {
        question: "What types of corporate training does Tobams Group Academy offer?",
        answer:
          "Tobams Group Academy provides a comprehensive range of corporate training programs, including courses in leadership development, business analysis, and specialized TGA cretified courses tailored to corporate needs.",
      },
      {
        question: "Can Tobams Group Academy customize training programs for specific organizational requirements?",
        answer:
          "Yes, Tobams Group Academy offers customizable corporate training solutions to align with specific organizational goals and requirements. Our team collaborates with clients to tailor content, duration, and delivery methods accordingly.",
      },
      {
        question: "Are the corporate training programs certified?",
        answer:
          "Depending on the nature of the program, Tobams Group Academy offers certified corporate training courses. Our TGA certified courses are recognized for their high standards in business analysis and related fields.",
      },
      {
        question: "What are the advantages of choosing Tobams Group Academy for corporate training?",
        answer:"Tobams Group Academy offers tailored, industry-relevant training, experienced instructors, flexible delivery options, and a track record of successful corporate partnerships. Our focus is on driving tangible results and enhancing the skills of employees."
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        question: "I'm experiencing technical issues. What should I do?",
        answer:
          "Please send a message to our support team by clicking the Contact Us link, and we'll assist you promptly.",
      },
    ],
  },
];