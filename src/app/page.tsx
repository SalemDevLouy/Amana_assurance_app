import Hero from './components/home/Hero';
import ProblemSolution from './components/home/ProblemSolution';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import Testimonials from './components/home/Testimonials';
import Faq from './components/home/FAQ';
import FinalCTA from './components/home/FinalCTA';
import Footer from './components/UI/Footer';



// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ededed] font-sans overflow-x-hidden">
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCTA />
      <Footer />
    </div>
  );
}