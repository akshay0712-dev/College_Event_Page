import React, { useState, useEffect } from 'react';

const Hero = ({ title, date, location }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-03-15T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(targetDate - now, 0);

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        mins: Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        ),
        secs: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="hero animate-on-scroll"
      aria-labelledby="hero-title"
    >
      <div className="hero-bg" aria-hidden="true"></div>

      <div className="container hero-content">
        <h1 id="hero-title" className="hero-title">
          {title}
        </h1>

        <p className="hero-meta">
          <span>
            <i className="fa-solid fa-calendar" aria-hidden="true"></i>{' '}
            {date}
          </span>
          <span>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>{' '}
            {location}
          </span>
        </p>

        <div className="countdown" aria-label="Event countdown">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="countdown-segment">
              <div className="countdown-value">{value}</div>
              <div className="countdown-label">
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        <div className="hero-cta" style={{ marginTop: '2rem' }}>
          <a href="#tickets" className="btn btn-accent">
            Register Now
          </a>
          <a href="#about" className="btn btn-outline">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
