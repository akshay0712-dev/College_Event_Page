import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const VideoHighlights = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const videosCollection = collection(db, 'videos');
    const q = query(videosCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const videosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videosData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePlayPause = (videoId) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (playingVideo === videoId) {
      video.pause();
      setPlayingVideo(null);
    } else {
      // Pause all other videos
      Object.keys(videoRefs.current).forEach((id) => {
        if (id !== videoId && videoRefs.current[id]) {
          videoRefs.current[id].pause();
        }
      });
      video.play();
      setPlayingVideo(videoId);
    }
  };

  const handleVideoEnd = (videoId) => {
    setPlayingVideo(null);
  };

  if (loading) {
    return (
      <section id="video" className="section video">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading highlights...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="video" className="section video animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Event Highlights 🎬</h2>
          <p className="section-tagline">Relive the magic from our past events</p>
        </header>

        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`video-card ${video.orientation || 'landscape'} ${
                  index === 0 ? 'featured' : ''
                }`}
              >
                <div className="video-player-wrapper">
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    className="custom-video-player"
                    src={video.url}
                    poster={video.thumbnail || ''}
                    onEnded={() => handleVideoEnd(video.id)}
                    onPlay={() => setPlayingVideo(video.id)}
                    onPause={() => setPlayingVideo(null)}
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom Play/Pause Overlay */}
                  <div
                    className={`video-overlay ${
                      playingVideo === video.id ? 'playing' : ''
                    }`}
                    onClick={() => handlePlayPause(video.id)}
                  >
                    <button className="play-pause-btn" aria-label="Play/Pause">
                      {playingVideo === video.id ? (
                        <i className="fa-solid fa-pause"></i>
                      ) : (
                        <i className="fa-solid fa-play"></i>
                      )}
                    </button>
                  </div>

                  {/* Video Info */}
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    {video.description && (
                      <p className="video-description">{video.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-video-slash"></i>
            <p>No video highlights available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoHighlights;