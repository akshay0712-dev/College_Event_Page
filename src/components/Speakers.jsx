import React from 'react';

const speakers = [
  {
    name: 'John Doe',
    role: 'Frontend Architect',
    img: 'https://placehold.co/300x300',
  },
  {
    name: 'Jane Smith',
    role: 'DevOps Engineer',
    img: 'https://placehold.co/300x300',
  },
  {
    name: 'Alex Riv',
    role: 'UI Designer',
    img: 'https://placehold.co/300x300',
  },
];

const Speakers = () => {
  return (
    <section
      id="speakers"
      className="section speakers animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Speakers & Guests</h2>
        </header>

        <ul className="speaker-grid">
          {speakers.map((speaker, i) => (
            <li key={i} className="speaker-card">
              <img
                src={speaker.img}
                alt={speaker.name}
                loading="lazy"
              />
              <h3>{speaker.name}</h3>
              <p>{speaker.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Speakers;
