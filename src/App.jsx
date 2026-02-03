import React, { useEffect } from "react";

/* ========== LAYOUT ========== */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* ========== SECTIONS ========== */
import Hero from "./components/Hero";
import About from "./components/About";
import VideoHighlights from "./components/VideoHighlights";
import EventCategories from "./components/EventCategories";
import Speakers from "./components/Speakers";
import NewsFeed from "./components/NewsFeed";
import Gallery from "./components/Gallery";
import Tickets from "./components/Tickets";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";

const App = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper" id="top">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main id="main-content">
        <Hero
          title="GEC Kishanganj Fresher Party 🎉"
          date="Welcoming the 2025 Batch"
          location="Government Engineering College, Kishanganj"
        />

        <About />
        <VideoHighlights />
        <EventCategories />
        <Speakers />
        <NewsFeed />
        <Gallery />
        <Tickets />
        <Team />
        <FAQ />
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
