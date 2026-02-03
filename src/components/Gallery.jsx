import React from "react";
import "../css/gallery.css";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    alt: "DJ night celebration",
    type: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    alt: "College dance performance",
    type: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    alt: "Friends enjoying party",
    type: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
    alt: "Live stage performance",
    type: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    alt: "Celebration moment",
    type: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    alt: "Group photo with friends",
    type: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    alt: "Party lights and crowd",
    type: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1520974735194-6c0f1d7a47bb",
    alt: "Friends dancing together",
    type: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    alt: "College night celebration",
    type: "tall",
  },
];

const Gallery = () => {
  return (
    <section id="gallery" className="gallery animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Moments & Memories 📸</h2>
          <p className="section-tagline">
            A night full of joy, laughter, and unforgettable memories
          </p>
        </header>

        <ul className="gta-gallery">
          {galleryImages.map((image, index) => (
            <li key={index} className={`gta-item ${image.type}`}>
              <div className="gta-frame">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Gallery;
