import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import LeetCodeWidget from "./components/LeetCode";
import EducationCerts from "./components/EducationCerts";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  return (
    <div className="bg-obsidian min-h-screen text-white">
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <LeetCodeWidget />
        <EducationCerts />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
