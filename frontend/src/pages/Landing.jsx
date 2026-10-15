import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero, { LandingFeatures } from "../components/layout/Hero";
import "../styles/Landing.css";

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <LandingFeatures />
      <Footer />
    </div>
  );
}

export default Landing;
