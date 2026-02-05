import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-branding">
            <h4>GEC Kishanganj Fresher Party</h4>
            <p>Welcoming the Class of 2025 with unforgettable memories.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#events">Timeline</a></li>
              <li><a href="#tickets">Passes</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <ul className="social-list">
              <li><a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a></li>
              <li><a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
              <li><a href="#" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '0.875rem', color: '#999' }}>
            © 2026 GEC Kishanganj. Made with ❤️ by the Organizing Committee.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;