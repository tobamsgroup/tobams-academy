"use client";

import { Button } from "../ui/Button";
import { ICONS } from "@/assets/icons";

export default function SupportSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section className=" py-8 md:py-16 px-6 md:px-16  bg-[#FFFAFA]">
      <div className="max-w-[1312px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

        {/* Left: Contact Information Card */}
        <div className="bg-[#E5E7EB] rounded-lg p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-primary">
            Contact Information
          </h3>

          <div className="flex flex-col gap-1">
            {/* Address */}
            <div className="flex items-start gap-4 py-4 border-b border-[#FFFFFF66]">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <ICONS.Location width={16} height={16} color="#fff" />
              </div>
              <p className="text-heading md:text-lg pt-1">
                71-75 Shelton Street, Covent Garden, London,
                United Kingdom, WC2H 9JQ
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 py-4 border-b border-[#FFFFFF66]">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <ICONS.Mail width={16} height={16} color="#fff" />
              </div>
              <a
                href="mailto:theteam@tobamgroupacademy.com"
                className="text-heading md:text-lg hover:text-[#1E2A6E] transition-colors max-w-[250px]"
              >
                theteam@tobamgroupacademy. <br className="md:hidden" /> com
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <ICONS.Phone width={16} height={16} color="#fff" />
              </div>
              <a
                href="tel:07886600748"
                className="text-heading md:text-lg hover:text-[#1E2A6E] transition-colors"
              >
                07886600748
              </a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white rounded-lg border border-[#D3D2D366] p-4 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Row 1: First Name + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border-[2px] border-[#E5E7EB] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full  border-[2px] border-[#E5E7EB] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 2: Phone + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full  border-[2px] border-[#E5E7EB] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="md:text-lg text-heading">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full  border-[2px] border-[#E5E7EB] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="md:text-lg text-heading ">
                Your Message
              </label>
              <textarea
                rows={7}
                className="w-full  border-[2px] border-[#E5E7EB] rounded-lg px-3 py-3 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1E2A6E] focus:border-transparent"
              />
            </div>

            {/* Submit — right aligned */}
            <div className="flex justify-end mt-3">
            <Button
                type="button"
                className="w-full bg-primary  px-16 py-3 text-base md:text-lg font-medium text-white hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060] hover:translate-y-0 md:w-fit"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}