import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
