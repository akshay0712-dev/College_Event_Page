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
          <ul className="flex flex-wrap justify-center gap-8">
  {events.map((event) => (
    <li
      key={event.id}
      className="w-full sm:w-[45%] lg:w-[30%] border border-white/10 rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-xl"
    >
      <i
        className={`fa-solid ${event.icon || "fa-star"} text-3xl mb-4 text-red-500`}
        aria-hidden="true"
      ></i>

      <h3 className="text-lg font-semibold text-white">
        {event.time} — {event.title}
      </h3>

      <p className="text-slate-400 mt-2">
        {event.desc}
      </p>
    </li>
  ))}
</ul>

        )}
      </div>
    </section>
  );
};

export default EventCategories;