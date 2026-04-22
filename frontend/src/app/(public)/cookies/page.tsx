import { Navbar } from "@/components/landing/Navbar";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";
import CookiePolicyHero from "@/components/cookies/Hero";
import CookiesContentSection from "@/components/cookies/CookiesContentSection";



export default function CookiePolicyPage() {
    return (
      <div>
          <Navbar shadow={false} />
          <CookiePolicyHero />
          <CookiesContentSection/>
          <Newsletter />
          <Footer />
      </div>
    )
  }