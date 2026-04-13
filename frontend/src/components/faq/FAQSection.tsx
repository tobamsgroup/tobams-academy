"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { ICONS } from "@/assets/icons";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { faqData } from "./data";

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentItems = faqData[activeCategory].items;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleCategoryChange = (i: number) => {
    setActiveCategory(i);
    setOpenIndex(null);
  };

  return (
    <section className="bg-white py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-8">

        {/* Left: Category tabs */}
        <div className="w-full flex-shrink-0 md:w-52">
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-left text-base font-semibold text-white"
              aria-haspopup="listbox"
              aria-expanded={mobileOpen}
            >
              <span>{faqData[activeCategory].label}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileOpen ? (
              <div
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-xl shadow-xl bg-white text-black"
                role="listbox"
              >
                {faqData.map((category, i) => (
                  <button
                    key={category.label}
                    type="button"
                    role="option"
                    aria-selected={activeCategory === i}
                    onClick={() => {
                      handleCategoryChange(i);
                      setMobileOpen(false);
                    }}
                    className={`w-full px-5 py-3.5 text-left text-base  transition-colors ${
                      activeCategory === i ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hidden flex-col gap-2 md:flex">
            {faqData.map((category, i) => (
              <button
                key={category.label}
                onClick={() => handleCategoryChange(i)}
                className={`text-left px-5 py-3 rounded-lg transition-colors duration-200 ${
                  activeCategory === i
                    ? "bg-primary text-white font-bold"
                    : "bg-[#D3D2D333] text-[#221D23] font-regular hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Accordion + CTA */}
        <div className="flex-1 flex flex-col gap-3">
          {currentItems.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden transition-colors duration-200 ${
                openIndex === i ? "bg-[#EEF0F6]" : "bg-[#D3D2D333]"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-6 text-left"
              >
                <span className="md:text-[20px] text-lg font-medium text-[#202020] pr-4">
                  {item.question}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    openIndex === i ? "border-heading text-heading" : "border-[#C3C0B7] text-[#C3C0B7]"
                  }`}
                >
                  {openIndex === i ? (
                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  )}
                </span>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="md:text-lg text-base text-[#221D23] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="flex justify-center mt-6 md:mt-8">
          <Button
                type="button"
                className="w-full bg-primary  px-8 py-3 text-base md:text-lg font-medium text-white hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060] hover:translate-y-0 md:w-fit"
                onClick={() => router.push("/contact")}
              >
                Contact Support
              </Button>
          </div>
        </div>

      </div>
    </section>
  );
}