import React from 'react';

const coreTeam = [
  {
    name: 'Prem Prakash',
    role: 'Event Coordinator',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
  {
    name: 'Achintya Singh',
    role: 'Lead Organizer',
    img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
  },
];

const Team = () => {
  return (
    <section
      id="team"
      className="section team animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Meet the Committee 🎓</h2>
          <p className="section-tagline">
            The faces behind an unforgettable fresher party
          </p>
        </header>

        <ul className="team-grid">
          {coreTeam.map((member, i) => (
            <li key={i} className="team-card">
              <img
                src={member.img}
                alt={member.name}
                loading="lazy"
              />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </li>
          ))}
        </ul>

        <p className="team-join">
          Want to be part of the crew?{' '}
          <a href="#contact">Join as a Volunteer</a>
        </p>
      </div>
    </section>
  );
};

export default Team;
