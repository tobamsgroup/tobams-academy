import { fetchUser } from "@/actions/session";
import { IMAGES } from "@/assets/images";
import { Navbar } from "@/components/landing/Navbar";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await fetchUser();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-[#571244]/5">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
