import { Navbar } from "@/components/landing/Navbar";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";
import PrivacyPolicyHero from "@/components/privacy/Hero";
import PrivacyContentSection from "@/components/privacy/PrivacyContentSection";



export default function PrivacyPolicyPage() {
    return (
      <div>
          <Navbar shadow={false} />
          <PrivacyPolicyHero />
          <PrivacyContentSection/>
          <Newsletter />
          <Footer />
      </div>
    )
  }