import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const galleryQuery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      galleryQuery,
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

  if (loading) {
    return (
      <section id="gallery" className="section gallery">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section gallery animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Event Gallery 📸</h2>
          <p className="section-tagline">
            Moments captured from our amazing events
          </p>
        </header>

        {images.length > 0 ? (
          <ul className="gallery-grid">
            {images.map((image) => (
              <li key={image.id}>
                <div className="gallery-item">
                  <img
                    src={image.url}
                    alt={image.alt || 'Gallery image'}
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <h4>{image.alt || 'Untitled'}</h4>
                      <p>{image.category}</p>
                    </div>
                  </div>
                  {image.category && (
                    <span className="gallery-badge">{image.category}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-images"></i>
            <p>No photos in gallery yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;