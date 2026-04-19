import { Navbar } from "@/components/landing/Navbar";
import FAQHero from "@/components/faq/Hero";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";
import FAQSection  from "@/components/faq/FAQSection";

export default function AboutUsPage() {
    return (
      <div>
          <Navbar shadow={false} />
          <FAQHero />
          <FAQSection />
          <Newsletter />
          <Footer />
      </div>
    )
  }