import Navbar from '../components/HomePage_components/Navbar';
import Hero from '../components/HomePage_components/Hero';
import HowItWorks from '../components/HomePage_components/HowItWorks';
import Statistics from '../components/HomePage_components/Statistics';
import Testimonials from '../components/HomePage_components/Testimonials';
import CTASection from '../components/HomePage_components/CTASection';
import Footer from '../components/HomePage_components/Footer';

import "../styles/global.css";
import "../styles/landing.css";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Statistics />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}

export default LandingPage;