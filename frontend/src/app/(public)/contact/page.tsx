import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Newsletter } from '@/components/landing/Newsletter'
import ContactFormSection from '@/components/corporate-form/CorporateForm'

const Contact = () => {
  return (
    <div>
       <Navbar shadow={false} />
       <ContactFormSection/>
       <Newsletter />
       <Footer />
    </div>
  )
}

export default Contact