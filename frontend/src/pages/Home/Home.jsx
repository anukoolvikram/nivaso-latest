import { useState, useEffect } from 'react';
import Hero from '../../components/Home/Hero';
import Navbar from '../../components/Home/Navbar';
import About from '../../components/Home/About';
import Contact from '../../components/Home/Contact';
import Services from '../../components/Home/Services';

const sections = ['home', 'services', 'about', 'contact'];

const Home = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const opts = { root: null, rootMargin: '0px', threshold: 0.3 };
    const cb = (entries) => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id));
    const obs = new IntersectionObserver(cb, opts);
    setTimeout(() => sections.forEach(id => document.getElementById(id) && obs.observe(document.getElementById(id))), 100);
    return () => sections.forEach(id => document.getElementById(id) && obs.unobserve(document.getElementById(id)));
  }, []);

  const handleNavClick = id => {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="">
      <Navbar sections={sections} activeSection={activeSection} onNavClick={handleNavClick}/>
        {sections.map(section => (
          <div key={section} id={section}>
            {{
              home: <Hero/>,
              services: <Services />, 
              about: <About />, 
              contact: <Contact />
            }[section]}
          </div>
        ))}
    </div>
  );
};

export default Home;
