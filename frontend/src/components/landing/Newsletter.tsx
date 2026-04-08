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
        className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-[16px] px-8 md:py-16 py-10 sm:flex-row sm:items-center md:px-12 bg-[#222643] -mb-22 relative z-10"
      >
        {/* Left */}
        <div>
          <h3 className="mb-1.5 text-[24px] font-semibold text-white sm:text-[32px]">
            Sign Up For Our <br className="md:hidden block" /> Newsletter
          </h3>
          <p className="text-sm md:text-[20px] text-white">
            Be the first to know about our latest updates and insights.
          </p>
        </div>

        {/* Right — form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row w-full flex-shrink-0 items-start md:gap-2 gap-4 sm:w-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-slate-600 bg-white px-4 py-3 text-sm text-slate-800 placeholder-[#474348] outline-none focus:border-slate-400 sm:w-64"
          />
          <Button
            type="submit"
            variant="primary"
            className="flex-shrink-0 rounded-lg bg-gradient-to-r from-[#252A64] to-[#252A64] px-5 py-3 text-sm font-semibold hover:shadow-[#252A64]/40 w-full md:w-auto"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}