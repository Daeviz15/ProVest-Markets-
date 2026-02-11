import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <Benefits />
      <Services />
      <Contact />
      <Faq />
      <Footer />
    </div>
  );
}
