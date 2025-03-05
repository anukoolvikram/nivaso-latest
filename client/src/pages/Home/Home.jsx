import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/HomeComponents/Hero";
import Features from "../../components/HomeComponents/Features";
import About from "../../components/HomeComponents/About";
import Contact from "../../components/HomeComponents/Contact";
import Pricing from "../../components/HomeComponents/Pricing";

import "./styles.css";

const sections = ["hero", "features", "about", "pricing", "contact"];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="relative bg-cover bg-center min-h-screen">
      {/* Content Sections (Navbar Removed) */}
      <div>
        {sections.map((section) => (
          <div key={section} id={section} className="min-h-screen flex items-center justify-center">
            {section === "hero" && <Hero />}
            {section === "features" && <Features />}
            {section === "about" && <About />}
            {section === "pricing" && <Pricing />}            
            {section === "contact" && <Contact />}
          </div>
        ))}
      </div>
    </div>
  );
}
