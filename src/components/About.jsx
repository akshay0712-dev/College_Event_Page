import React from 'react';

const About = () => {
  return (
    <section id="about" className="section about animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>About the Fresher Party 🎉</h2>
          <p className="section-tagline">
            Welcome to the most awaited night of the year!
          </p>
        </header>

        <div className="about-grid">
          <div>
            <p>
              The GEC Kishanganj Fresher Party is more than just an event — it's a 
              celebration of new beginnings, friendships, and unforgettable memories. 
              Join us for an evening filled with music, dance, food, and fun!
            </p>
            <p>
              Whether you're a fresher or a senior, this is your chance to let loose, 
              showcase your talents, and create memories that will last a lifetime.
            </p>
            <p>
              Don't miss out on the DJ night, games, performances, and much more. 
              See you on the dance floor! 🕺💃
            </p>
          </div>

          <aside className="about-stats">
            <ul>
              <li><strong>500+</strong> Expected Attendees</li>
              <li><strong>6 Hours</strong> of Non-Stop Fun</li>
              <li><strong>Live DJ</strong> Performance</li>
              <li><strong>Food & Drinks</strong> Included</li>
              <li><strong>Games & Prizes</strong> to Win</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;