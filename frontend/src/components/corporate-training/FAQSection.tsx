"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICONS } from "@/assets/icons";
import { Button } from "@/components/ui/Button";

const FAQS = [
  {
    id: 1,
    question: "What Type of Corporate Training Does Tobams Group Academy offer?",
    answer:
      "Tobams Group Academy provides a comprehensive range of corporate training programs, including courses in leadership development, business analysis, and specialized TGA cretified courses tailored to corporate needs.",
  },
  {
    id: 2,
    question: "Can Tobams Group Academy Customize Training Programs for Specific Organizational Requirements?",
    answer:
      "Yes, TGA offers a selection of free courses to help learners get started. These cover foundational topics across various categories including business, leadership, and technology.",
  },
  {
    id: 3,
    question: "Are the Corporate Training Programs Certified?",
    answer:
      "The average learning period varies by course, but most programs are designed to be completed within 4 to 12 weeks depending on the depth of content and your pace of study.",
  },
];

export function FAQSection() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className=" px-5 py-12 md:py-16 md:px-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-[24px] font-medium md:font-bold text-slate-900 sm:text-3xl md:text-[40px]">
          Frequently Asked Questions
        </h2>
        <p className="md:text-lg text-base text-body">Everything you need to know.</p>
      </div>

      {/* Accordion */}
      <div className="mx-auto flex max-w-[800px] flex-col gap-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-[16px] transition-colors duration-200 ${
                isOpen
                  ? "bg-[#EEF0F6]"
                  : "bg-[#D3D2D333]"
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="md:text-[20px] text-lg font-medium text-heading">
                  {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0">
                  {isOpen ? (
                    <ICONS.CircleMinus width={24} height={24} stroke="var(--color-heading)" />
                  ) : (
                    <ICONS.CirclePlus width={24} height={24} stroke="#C3C0B7" />
                  )}
                </span>
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="px-6 pb-6">
                  <p className="md:text-lg text-base leading-relaxed text-heading">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA button */}
      <div className="mt-10 flex justify-center">
        <Button
          type="button"
          variant="primary"
          className="rounded-lg bg-primary px-10 py-3.5 md:text-lg text-base"
          onClick={() => router.push("/faq")}
        >
          Read More FAQs
        </Button>
      </div>
    </section>
  );
}