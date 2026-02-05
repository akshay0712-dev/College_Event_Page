import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const speakersCollection = collection(db, 'speakers');
    const q = query(speakersCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const speakersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSpeakers(speakersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching speakers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="speakers" className="section speakers">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading speakers...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="speakers" className="section speakers animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Speakers & Guests 🎤</h2>
          <p className="section-tagline">Meet our distinguished guests</p>
        </header>

        {speakers.length > 0 ? (
          <ul className="speaker-grid">
            {speakers.map((speaker) => (
              <li key={speaker.id} className="speaker-card">
                <img
                  src={speaker.img || 'https://via.placeholder.com/300'}
                  alt={speaker.name}
                  loading="lazy"
                />
                <h3>{speaker.name}</h3>
                <p>{speaker.role}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}>No speakers announced yet.</p>
        )}
      </div>
    </section>
  );
};

export default Speakers;