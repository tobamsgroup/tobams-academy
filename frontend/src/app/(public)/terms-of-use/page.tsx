import { Navbar } from "@/components/landing/Navbar";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";
import TermsHero from "@/components/terms-of-use/Hero";
import TermsContentSection from "@/components/terms-of-use/TermsContentSection";


export default function SupportPage() {
    return (
      <div>
          <Navbar shadow={false} />
          <TermsHero />
          <TermsContentSection/>
          <Newsletter />
          <Footer />
      </div>
    )
  }