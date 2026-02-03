import React from 'react';
import "../css/footer.css";
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer spotlight-footer">
      {/* Spotlight background */}
      <div className="footer-spotlight" aria-hidden="true"></div>

      <div className="footer-container">

        {/* COLLEGE / EVENT INFO */}
        <div className="footer-brand">
          <h4>Government Engineering College, Kishanganj</h4>
          <p className="footer-subtitle">Fresher Party 2025</p>
          <p className="footer-desc">
            An official welcome event organized by the 2024 batch
            for the incoming 2025 batch students of GEC Kishanganj.
          </p>
        </div>

        {/* QUICK NAVIGATION */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <h5>Explore</h5>
          <a href="#about">About Event</a>
          <a href="#events">Event Timeline</a>
          <a href="#gallery">Gallery</a>
          <a href="#tickets">Passes</a>
          <a href="#faq">FAQs</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* SOCIAL + META */}
        <div className="footer-meta">
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" aria-label="WhatsApp">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>

          <div className="footer-legal">
            <span>© {year} Government Engineering College, Kishanganj</span>
            <span>All rights reserved</span>
            <span>Organized by 2024 Batch</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
    