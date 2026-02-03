import React from 'react';

const eventTimeline = [
  {
    time: '06:30 PM',
    icon: 'fa-door-open',
    title: 'Entry & Welcome',
    desc: 'Freshers arrive, registration, and a warm welcome by seniors.',
  },
  {
    time: '07:00 PM',
    icon: 'fa-microphone-lines',
    title: 'Opening Ceremony',
    desc: 'Welcome speech and introduction by the 2024 batch.',
  },
  {
    time: '07:30 PM',
    icon: 'fa-music',
    title: 'Cultural Performances',
    desc: 'Dance, singing, and fun performances to set the mood.',
  },
  {
    time: '08:30 PM',
    icon: 'fa-gamepad',
    title: 'Games & Fun Activities',
    desc: 'Interactive games, laughter, dares, and bonding moments.',
  },
  {
    time: '09:30 PM',
    icon: 'fa-headphones',
    title: 'DJ Night',
    desc: 'Dance floor opens with DJ beats and full party vibes 🔥',
  },
  {
    time: '10:45 PM',
    icon: 'fa-star',
    title: 'Freshers’ Introduction',
    desc: 'Confidence walk, introductions, and special fresher moments.',
  },
  {
    time: '11:30 PM',
    icon: 'fa-camera-retro',
    title: 'Closing & Memories',
    desc: 'Group photos, vote of thanks, and memories for life 💛',
  },
];

const EventCategories = () => {
  return (
    <section
      id="events"
      className="section events animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party Timeline 🎉</h2>
          <p className="section-tagline">
            One Night • Endless Memories • Welcome 2025 Batch
          </p>
        </header>

        <ul className="event-category-grid">
          {eventTimeline.map((event, index) => (
            <li key={index} className="event-category-card">
              <i
                className={`fa-solid ${event.icon} event-icon`}
                aria-hidden="true"
              ></i>
              <h3>
                {event.time} — {event.title}
              </h3>
              <p>{event.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EventCategories;
