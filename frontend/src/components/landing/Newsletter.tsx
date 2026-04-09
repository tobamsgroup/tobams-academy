// components/Newsletter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle subscription logic
    setEmail("");
  };

  return (
    <section className=" px-5 pb-0 md:px-16">
      <div
        className="relative z-10 mx-auto -mb-22 flex max-w-5xl flex-col items-start justify-between gap-6 rounded-[16px] bg-[#222643] px-8 py-10 md:px-12 md:py-16 lg:flex-row lg:items-center"
      >
        {/* Left */}
        <div>
          <h3 className="mb-1.5 text-[24px] font-semibold text-white sm:text-[32px]">
            Sign Up For Our <br className="lg:hidden" /> Newsletter
          </h3>
          <p className="text-sm md:text-[20px] text-white">
            Be the first to know about our latest updates and insights.
          </p>
        </div>

        {/* Right — form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-shrink-0 flex-col items-start gap-4 lg:w-auto lg:flex-row lg:gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-slate-600 bg-white px-4 py-3 text-sm text-slate-800 placeholder-[#474348] outline-none focus:border-slate-400 lg:w-64"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full flex-shrink-0 rounded-lg bg-gradient-to-r from-[#252A64] to-[#252A64] px-5 py-3 text-sm font-semibold hover:shadow-[#252A64]/40 lg:w-auto"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}