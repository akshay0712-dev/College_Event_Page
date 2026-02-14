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
   <section className="relative py-24  overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        Meet Our Speakers 🎤
      </h2>
      <p className="mt-4 text-slate-400">
        The inspiring voices behind our unforgettable farewell
      </p>
    </div>

    {speakers.length > 0 ? (
      <div className="flex flex-wrap justify-center gap-10 px-10 md:p-0">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className="group relative w-full sm:w-[45%] lg:w-[22%] border border-white/10 rounded-3xl p-8 text-center transition duration-500 hover:-translate-y-4 hover:border-white/30 hover:shadow-2xl"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

            {/* Image */}
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full  blur-md opacity-60 group-hover:opacity-90 transition"></div>
              <img
                src={speaker.img || "https://via.placeholder.com/300"}
                alt={speaker.name}
                loading="lazy"
                className="relative w-32 h-32 object-cover rounded-full border-4 border-black shadow-lg"
              />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-white">
              {speaker.name}
            </h3>
            <p className="text-slate-400 mt-2">
              {speaker.role}
            </p>
          </div>
        ))}
       
      </div>
    ) : (
      <p className="text-center text-slate-400">
        No speakers announced yet.
      </p>
    )}
  </div>
</section>
  );
};

export default Speakers;