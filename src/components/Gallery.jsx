import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const galleryCollection = collection(db, 'gallery');
    const q = query(galleryCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const imagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imagesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching gallery:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredImages =
    filter === 'all' ? images : images.filter((img) => img.category === filter);

  if (loading) {
    return (
      <section id="gallery" className="section gallery">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Loading gallery...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section gallery animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party Moments 📸</h2>
          <p className="section-tagline">Memories captured, moments cherished</p>
        </header>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {['all', 'party', 'dance', 'dj', 'food', 'games'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === category
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              style={{
                backgroundColor:
                  filter === category ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                color: filter === category ? '#000' : '#999',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <ul className="gallery-grid">
            {filteredImages.map((image) => (
              <li key={image.id}>
                <img src={image.url} alt={image.alt || 'Gallery image'} loading="lazy" />
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No photos in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Gallery;