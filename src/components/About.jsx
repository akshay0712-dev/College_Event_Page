import React from 'react';

const About = () => {
  return (
    <section id="about" className="section about animate-on-scroll">
      <div className="container">

        {/* SECTION HEADER */}
        <header className="section-header">
          <h2>Welcome Freshers 🎉</h2>
          <p className="section-tagline">
            A warm welcome to the 2025 batch from your seniors — the 2024 batch 💛
          </p>
        </header>

        <div className="about-grid">

          {/* ABOUT TEXT */}
          <div className="about-desc">
            <p>
              Welcome to <strong>Government Engineering College, Kishanganj</strong> —
              a place where friendships are built, dreams take shape, and memories
              last a lifetime.
            </p>

            <p>
              This fresher party is not just an event, it’s our way of saying:
              <em> “You’re not juniors anymore — you’re family now.” </em>
            </p>

            <p>
              As your seniors from the <strong>2024 batch</strong>, we know the
              excitement, nervousness, and curiosity you’re feeling right now.
              Trust us — this journey will be one of the most beautiful chapters
              of your life.
            </p>

            <blockquote style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
              “Enjoy every lecture, every bunk, every laugh — because one day,
              you’ll miss these days more than you think.” ❤️  
              <br />
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                — With love, your seniors
              </span>
            </blockquote>
          </div>

          {/* SIDE PANEL */}
          <aside className="about-history">
            <h3>What Awaits You ✨</h3>
            <ul className="about-stats">
              <li><strong>🎓</strong> New friendships & lifelong bonds</li>
              <li><strong>🎶</strong> Cultural nights & unforgettable parties</li>
              <li><strong>📚</strong> Learning, growth & self-discovery</li>
              <li><strong>🏆</strong> Opportunities to shine & lead</li>
            </ul>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default About;
