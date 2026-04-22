"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { IMAGES } from "@/assets/images";
import { Button } from "@/components/ui/Button";
import SuccessModal from "./SuccessModal";

const EMPLOYEE_OPTIONS = [
  { value: "1-50", label: "1 - 50" },
  { value: "50-100", label: "50 - 100" },
  { value: "100+", label: "100+" },
] as const;

const TRAINING_OPTIONS = [
  { value: "leadership", label: "Leadership" },
  { value: "sustainability", label: "Sustainability" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "interviewing-skills", label: "Interviewing Skills" },
  { value: "it", label: "IT" },
  { value: "innovation", label: "Innovation" },
  { value: "ngo", label: "NGO" },
] as const;

type ListboxOption = { value: string; label: string };

function FormListbox({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
}: {
  label: string;
  options: readonly ListboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label htmlFor={id} className="text-lg text-heading">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between gap-2 rounded-[8px] border border-[#CFC9D0] bg-[#FFFFFF00] px-3 py-[10px] text-left text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] ${
            value ? "text-heading" : "text-gray-500"
          }`}
        >
          <span className="min-w-0 truncate">{selectedLabel || placeholder}</span>
          <ChevronDown
            aria-hidden
            className={`h-4 w-4 shrink-0 text-body transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open ? (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-[8px] border border-heading bg-white py-1 shadow-sm"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className="w-full px-3 py-2.5 text-left text-sm text-heading hover:bg-[#F5F5F7]"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ContactFormSection() {
  const [agreed, setAgreed] = useState(false);
  const [employeeRange, setEmployeeRange] = useState("");
  const [trainingInterest, setTrainingInterest] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessOpen(true);
  };

  return (
    <section className="bg-[#EEF0F6] py-16 px-6 md:px-16 lg:px-24 mb-16">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left: Form */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-5">
            <h2 className="text-[28px] font-semibold text-heading">
              Speak to Our Training Experts
            </h2>
            <p className="text-body text-base md:text-lg">
              Fill out the form below and our team will get back to you within
              2-3 working days to discuss your training needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Row 1: Company Name + Contact Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full border border-[#CFC9D0] rounded-[8px] px-3 py-[10px] text-sm bg-[#FFFFFF00] focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  Contact Name
                </label>
                <input
                  type="text"
                  className="w-full border border-[#CFC9D0] rounded-[8px] px-3 py-[10px] text-sm bg-[#FFFFFF00] focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="flex flex-col gap-1.5">
              <label className="md:text-lg text-heading">
                Work Email Address
              </label>
              <input
                type="email"
                className="w-full border border-[#CFC9D0] rounded-[8px] px-3 py-[10px] text-sm bg-[#FFFFFF00] focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
              />
            </div>

            {/* Phone Number with country selector */}
            <div className="flex flex-col gap-1.5">
              <label className="md:text-lg text-heading">
                Phone Number
              </label>
              <div className="flex border border-[#CFC9D0] rounded-[8px] bg-[#FFFFFF00] overflow-hidden focus-within:ring-2 focus:ring-[#1E2A6E]">
                <select className="pl-3 pr-1 py-2.5 text-sm text-gray-700 bg-[#FFFFFF00] border-r border-gray-300 focus:outline-none">
                  <option value="uk">UK</option>
                  <option value="ng">NG</option>
                  <option value="us">US</option>
                  <option value="gh">GH</option>
                </select>
                <input
                  type="tel"
                  className="flex-1 px-3 py-[10px] text-sm bg-[#FFFFFF00] focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Number of Employees + Training Interest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormListbox
                label="Number Of Employees"
                options={EMPLOYEE_OPTIONS}
                value={employeeRange}
                onChange={setEmployeeRange}
              />
              <FormListbox
                label="Training Interest"
                options={TRAINING_OPTIONS}
                value={trainingInterest}
                onChange={setTrainingInterest}
              />
            </div>
            <input type="hidden" name="employeeRange" value={employeeRange} />
            <input type="hidden" name="trainingInterest" value={trainingInterest} />

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="md:text-lg text-heading">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full border border-[#CFC9D0] rounded-[8px] px-3 py-[10px] text-sm bg-[#FFFFFF00] resize-none focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
              />
            </div>

            {/* Privacy policy checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1E2A6E]"
              />
              <span className="text-body text-base md:text-lg">
                You agree to our friendly{" "}
                <a
                  href="/privacy-policy"
                  className="text-primary underline hover:opacity-80"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold shadow-md hover:bg-[#162060] hover:shadow-[#1E2A6E]/30 hover:translate-y-0"
            >
              Submit
            </Button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="relative w-full h-[840px] rounded-[20px] overflow-hidden hidden md:block">
          <Image
            src={IMAGES.contact}
            alt="Training experts"
            fill
            className="object-cover object-top"
          />
        </div>

      </div>

      <SuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />
    </section>
  );
}