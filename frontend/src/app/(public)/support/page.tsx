import { Navbar } from "@/components/landing/Navbar";
import SupportHero from "@/components/support/Hero";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";
import SupportSection from "@/components/support/SupportSection";


export default function SupportPage() {
    return (
      <div>
          <Navbar shadow={false} />
          <SupportHero />
          <SupportSection />
          <Newsletter />
          <Footer />
      </div>
    )
  }