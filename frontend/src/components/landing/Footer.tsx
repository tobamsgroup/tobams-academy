// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES } from '../../assets/images/index';
import { ICONS } from "@/assets/icons";

const COMPANY_LINKS = [
  { label: "About us",    href: "/about" },
  { label: "Courses",     href: "/courses" },
  { label: "FAQs",        href: "/faq" },
  { label: "Contact Us",  href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "Newsletter",  href: "/newsletter" },
  { label: "Support",     href: "/support" },
];

const LEGAL_LINKS = [
  { label: "Terms Of Use",    href: "/terms-of-use" },
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Cookie Policy",   href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="px-5 bg-[#101321] pt-[150px] pb-8 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Main grid */}
        <div className="mb-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:grid-cols-[650px_1fr_1fr_1fr]">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-1 ">
            <div className="mb-8 flex items-center gap-3">
              <Image
                src={IMAGES.footerLogo}
                alt="Tobams Group Academy"
                width={65}
                height={65}
                className="object-contain"
              />
              <span className="md:text-[24px] text-[20px] font-extrabold text-white">
                Tobams Group Academy
              </span>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-white max-w-[350px] md:max-w-[338px]">
              Empowering learners everywhere with access to quality courses and
              resources to grow their skills and knowledge.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="#" className="transition-colors hover:text-white">
                <ICONS.Facebook width={24} height={24} className="text-white" />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <ICONS.Instagram width={24} height={24} className="text-white" />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <ICONS.Twitter width={24} height={24} className="text-white" />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <ICONS.LinkedIn width={24} height={24} className="text-white" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 md:text-lg text-base font-semibold text-white">Company</h4>
            <ul className="flex flex-col gap-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="md:text-lg text-base font-medium text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 md:text-lg text-base font-semibold text-white">Resources</h4>
            <ul className="flex flex-col gap-3">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="md:text-lg text-base font-medium text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 md:text-lg text-base font-semibold text-white">Legal</h4>
            <ul className="flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="md:text-lg text-base font-medium text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-white">
          © 2026 Tobams Group Academy. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}