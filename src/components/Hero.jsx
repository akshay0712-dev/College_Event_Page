import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Hero = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const eventsCollection = collection(db, 'heroEvents');
    const now = new Date();
    const q = query(
      eventsCollection,
      where('eventDate', '>=', now),
      orderBy('eventDate', 'asc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const eventData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
        setCurrentEvent(eventData);
      } else {
        setCurrentEvent(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching hero event:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentEvent || !currentEvent.eventDate) return;

    const targetDate = currentEvent.eventDate.toDate().getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(targetDate - now, 0);

      if (distance === 0) {
        clearInterval(interval);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }

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
  }, [currentEvent]);

  if (loading) {
    return (
      <section id="home" className="hero">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="container hero-content">
          <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>
            Loading event...
          </p>
        </div>
      </section>
    );
  }

  if (!currentEvent) {
    return (
      <section id="home" className="hero">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="container hero-content">
          <h1 className="hero-title">No Upcoming Events</h1>
          <p className="hero-meta">Stay tuned for new announcements!</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="hero animate-on-scroll h-screen! "
      aria-labelledby="hero-title"
    >
      {/* VIDEO BACKGROUND */}
      {currentEvent.backgroundVideo ? (
        <div className="hero-video-wrapper">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={currentEvent.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : currentEvent.backgroundImage ? (
        <div 
          className="hero-bg" 
          aria-hidden="true"
          style={{
            backgroundImage: `url(${currentEvent.backgroundImage})`
          }}
        ></div>
      ) : (
        <div 
          className="hero-bg" 
          aria-hidden="true"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        ></div>
      )}

      {/* Overlay */}
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <h1 id="hero-title" className="hero-title">
          {currentEvent.title || 'Upcoming Event'}
        </h1>

        <p className="hero-meta">
          <span>
            <i className="fa-solid fa-calendar" aria-hidden="true"></i>{' '}
            {currentEvent.date || 'Date TBA'}
          </span>
          <span>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>{' '}
            {currentEvent.location || 'Location TBA'}
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