import React from 'react';

const newsItems = [
  {
    title: '🎉 Fresher Party Date Announced!',
    date: 'Sept 20, 2025',
    cat: 'Announcement',
  },
  {
    title: '🎟️ Limited Passes Available – Book Fast!',
    date: 'Sept 10, 2025',
    cat: 'Alert',
  },
  {
    title: '🎶 DJ Night Confirmed with Special Performances',
    date: 'Sept 12, 2025',
    cat: 'Update',
  },
  {
    title: '👗 Dress Code Revealed: Smart Party Wear',
    date: 'Sept 14, 2025',
    cat: 'Info',
  },
  {
    title: '📸 Photo Booth & Fun Games Added',
    date: 'Sept 16, 2025',
    cat: 'Fun',
  },
];

const NewsFeed = () => {
  return (
    <section
      id="news"
      className="section news animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Latest Updates 📰</h2>
          <p className="section-tagline">
            Stay updated with all fresher party announcements
          </p>
        </header>

        <div className="news-cards">
          {newsItems.map((item, i) => (
            <article
              key={i}
              className="news-card animate-on-scroll"
            >
              <h3>{item.title}</h3>

              <footer>
                <span className="news-category-badge">
                  {item.cat}
                </span>
                <time dateTime={item.date}>
                  {item.date}
                </time>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
