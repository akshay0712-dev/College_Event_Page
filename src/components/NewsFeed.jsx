import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsCollection = collection(db, 'news');
    const q = query(
      newsCollection, 
      orderBy('createdAt', 'desc'), 
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNewsItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="news" className="section news animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Latest Updates 📰</h2>
          <p className="section-tagline">
            Stay updated with all fresher party announcements
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Fetching latest updates...</p>
          </div>
        ) : (
          <div className="news-cards">
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <article
                  key={item.id}
                  className="news-card animate-on-scroll"
                >
                  <h3>{item.title}</h3>
                  <footer>
                    <span className="news-category-badge">
                      {item.cat || 'General'}
                    </span>
                    <time dateTime={item.date}>
                      {item.date}
                    </time>
                  </footer>
                </article>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>No updates yet. Stay tuned!</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;