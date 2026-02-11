import React, { useState } from 'react';
import '../css/Contact.css';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section contact animate-on-scroll">
      <div className="container contact-grid">

        {/* CONTACT FORM */}
        <div className="contact-form-wrapper">  
          <header className="section-header contact-header-left">
            <h2>Contact Us</h2>
            <p className="section-tagline">
              Have questions? We’d love to hear from you.
            </p>
          </header>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn btn-accent">
              Send Message
            </button>
          </form>
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info-wrapper">
          <h3>Location</h3>
          <p>Pragati Maidan, New Delhi, India</p>

          <div className="contact-map-wrapper">
            <div className="contact-map">
              <p>📍 Map will appear here</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
