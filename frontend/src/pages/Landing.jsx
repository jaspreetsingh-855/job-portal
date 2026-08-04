import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";
import "../styles/Landing.css";

function Landing() {
  return (
    <div className="public-page">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default Landing;
