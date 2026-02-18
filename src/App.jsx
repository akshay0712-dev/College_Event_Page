import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase/config";

// Component Imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import VideoHighlights from "./components/VideoHighlights";
import EventCategories from "./components/EventCategories";
import Speakers from "./components/Speakers";
import NewsFeed from "./components/NewsFeed";
import Gallery from "./components/Gallery";
import Sponsors from "./components/Sponsor";
import Tickets from "./components/Tickets";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import FullScreenLoader from "./components/FullScreenLoader";
import BackgroundParticles from "./components/BackgroundParticles";
import JuniorRegistration from "./components/JuniorRegistration";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";

// ===============================
// Scroll Observer
// ===============================
const ScrollObserver = () => {
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
};

// ===============================
// Main Landing Layout
// ===============================
const MainSite = () => (
  <div className="page-wrapper relative" id="top">
    <BackgroundParticles />
    <ScrollObserver />

    <Header />

    <main id="main-content">
      <Hero />
      <About />
      <VideoHighlights />
      <EventCategories />
      <Speakers />
      <NewsFeed />
      <Gallery />
      <Sponsors />
      <Tickets />
      <Team />
      <FAQ />
      <Contact />
    </main>

    <Footer />
  </div>
);

// ===============================
// Main App
// ===============================
const App = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // 1️⃣ Firebase Auth Listener
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
    });

    // 2️⃣ Minimum 2 second timer
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Loader only disappears when BOTH are true
  const loading = !(authReady && minTimePassed);

  return (
    <>
      <FullScreenLoader isLoading={loading} />
      {/* <FullScreenLoader isLoading={true} /> */}

      <Router>
        <Routes>
          <Route path="/" element={<MainSite />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/admin" /> : <AdminLogin />}
          />

          <Route
            path="/admin"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/booknow" element={<JuniorRegistration />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
