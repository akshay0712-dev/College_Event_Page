import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Sponsors from "./components/Sponsor" // <--- IMPORT ADDED
import Tickets from "./components/Tickets";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";

// Intersection Observer for Scroll Animations
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
};

// Main Landing Page Layout
const MainSite = () => (
  <div className="page-wrapper" id="top">
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
      <Sponsors /> {/* <--- COMPONENT ADDED HERE */}
      <Tickets />
      <Team />
      <FAQ />
      <Contact />
    </main>
    <Footer />
  </div>
);

// Main App Component with Routing & Auth
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <AdminLogin />} />
        <Route path="/admin" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;