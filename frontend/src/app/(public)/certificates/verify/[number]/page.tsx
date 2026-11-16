import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, SearchX } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { findCertificateByNumber } from "@/lib/certificates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify a certificate | Tobams Academy",
  robots: { index: false },
};

/** Public page linked from every certificate: confirms the certificate is genuine. */
export default async function VerifyCertificatePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const cert = await findCertificateByNumber(decodeURIComponent(number));

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8FA]">
      <Navbar shadow={false} />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg rounded-[16px] border border-[#D3D2D366] bg-white p-8 text-center shadow-sm">
          {cert ? (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F6EC] text-[#0F7B3F]">
                <BadgeCheck className="h-8 w-8" aria-hidden />
              </span>
              <h1 className="mt-4 text-xl font-bold text-[#111827]">Verified certificate</h1>
              <p className="mt-2 text-sm text-[#474348]">
                This certificate was issued by Tobams Group Academy and is genuine.
              </p>
              <dl className="mt-6 divide-y divide-[#EEEEF2] rounded-lg border border-[#EEEEF2] text-left text-sm">
                {[
                  ["Awarded to", cert.learnerName],
                  ["Course", cert.courseTitle],
                  [
                    "Date of issue",
                    new Date(cert.issuedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  ],
                  ["Certificate no.", cert.certificateNumber],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-[#6C686C]">{label}</dt>
                    <dd className="text-right font-medium text-[#111827]">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <SearchX className="h-8 w-8" aria-hidden />
              </span>
              <h1 className="mt-4 text-xl font-bold text-[#111827]">Certificate not found</h1>
              <p className="mt-2 text-sm text-[#474348]">
                We couldn&apos;t find a certificate numbered{" "}
                <span className="font-mono font-semibold">{decodeURIComponent(number)}</span>. Check the number
                printed at the bottom of the certificate and try again.
              </p>
            </>
          )}
          <Link href="/courses" className="mt-6 inline-block text-sm font-medium text-[#303869] hover:underline">
            Explore Tobams Academy courses
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
