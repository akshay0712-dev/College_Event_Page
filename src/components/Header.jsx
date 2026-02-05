import React, { useState } from 'react';
import "../css/header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header spotlight-header" id="top">
      <div className="header-spotlight" aria-hidden="true"></div>
      <div className="container header-inner">
        <a href="#top" className="logo" onClick={closeMenu}>
          <span className="logo-text">
            Government Engineering College, Kishanganj
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <button
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="primary-menu"
            aria-label="Toggle navigation"
          >
            <span className="hamburger"></span>
          </button>
          <ul
            id="primary-menu"
            className={`nav-menu ${isOpen ? 'is-open' : ''}`}
          >
            <li>
              <a href="#top" onClick={closeMenu}>
                <i className="fa-solid fa-house nav-icon" aria-hidden="true"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#about" onClick={closeMenu}>
                <i className="fa-solid fa-circle-info nav-icon" aria-hidden="true"></i>
                <span>About</span>
              </a>
            </li>
            <li>
              <a href="#events" onClick={closeMenu}>
                <i className="fa-solid fa-clock nav-icon" aria-hidden="true"></i>
                <span>Timeline</span>
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={closeMenu}>
                <i className="fa-solid fa-images nav-icon" aria-hidden="true"></i>
                <span>Gallery</span>
              </a>
            </li>
            <li>
              <a href="#tickets" onClick={closeMenu}>
                <i className="fa-solid fa-ticket nav-icon" aria-hidden="true"></i>
                <span>Passes</span>
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>
                <i className="fa-solid fa-envelope nav-icon" aria-hidden="true"></i>
                <span>Contact</span>
              </a>
            </li>
            <li className="nav-button-wrapper">
              <a href="#tickets" className="nav-cta" onClick={closeMenu}>
                <i className="fa-solid fa-bolt"></i>
                <span>Book Pass</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;