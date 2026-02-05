import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const EventCategories = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsCollection = collection(db, 'events');
    const q = query(eventsCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching timeline:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="events" className="section events animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party Timeline 🎉</h2>
          <p className="section-tagline">
            One Night • Endless Memories • Welcome 2025 Batch
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <p>Loading schedule...</p>
          </div>
        ) : (
          <ul className="event-category-grid">
            {events.map((event) => (
              <li key={event.id} className="event-category-card">
                <i
                  className={`fa-solid ${event.icon || 'fa-star'} event-icon`}
                  aria-hidden="true"
                ></i>
                <h3>
                  {event.time} — {event.title}
                </h3>
                <p>{event.desc}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default EventCategories;