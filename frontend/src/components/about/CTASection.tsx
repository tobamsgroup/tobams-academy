"use client";

import { Button } from "@/components/ui/Button";

export default function CTASection() {
    return (
      <section className="pt-6 pb-[36px] md:py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-[24px] lg:text-[40px] font-medium md:font-bold text-primary">
            Ready to Start Your Journey?
          </h2>
  
          <p className="text-body text-base md:text-lg text-center">
            Join thousands of professionals advancing their careers through our
            structured learning <br className="md:hidden" /> platform.
          </p>
  
          <Button
            type="button"
            variant="primary"
            className="mt-2 w-full max-w-[347px] rounded-lg bg-primary px-10 py-5 md:text-lg font-medium hover:shadow-[#1E2A6E]/40"
            onClick={() => {
              document.querySelector("#courses")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Courses
          </Button>
        </div>
      </section>
    );
  }