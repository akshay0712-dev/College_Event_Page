import React from 'react';

const VideoHighlights = () => {
  return (
    <section
      id="video"
      className="section video animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Event Highlights</h2>
        </header>

        <div className="video-embed-wrapper">
          {/* Replace with your actual YouTube/Vimeo ID */}
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="DevCon Highlights"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 'var(--radius-lg)' }}
          ></iframe>
        </div>

        <p className="video-caption">
          Experience the energy of last year's sold-out event.
        </p>
      </div>
    </section>
  );
};

export default VideoHighlights;
