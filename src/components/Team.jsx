import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Team = () => {
  const [coreTeam, setCoreTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamCollection = collection(db, 'team');
    const q = query(teamCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoreTeam(teamData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching team:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="team" className="section team">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading team...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="section team animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Meet the Committee 🎓</h2>
          <p className="section-tagline">
            The faces behind an unforgettable fresher party
          </p>
        </header>

        {coreTeam.length > 0 ? (
          <ul className="team-grid">
            {coreTeam.map((member) => (
              <li key={member.id} className="team-card">
                <img
                  src={member.img || 'https://via.placeholder.com/80'}
                  alt={member.name}
                  loading="lazy"
                />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}>No team members added yet.</p>
        )}

        <p className="team-join">
          Want to be part of the crew?{' '}
          <a href="#contact">Join as a Volunteer</a>
        </p>
      </div>
    </section>
  );
};

export default Team;