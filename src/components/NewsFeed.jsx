import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsCollection = collection(db, "news");
    const q = query(newsCollection, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsItems(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="news" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Latest Updates 📰
          </h2>
          <p className="text-gray-500">
            Stay updated with all fresher party announcements
          </p>
        </header>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 animate-pulse">
              Fetching latest updates...
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <article
                  key={item.id}
                  className="
                    w-full
                    sm:w-[45%]
                    lg:w-[30%]
                    border border-gray-200
                    rounded-lg
                    p-6
                    flex flex-col
                    transition duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-4">
                    {item.title}
                  </h3>

                  <footer className="mt-auto pt-4 flex justify-between items-baseline text-sm text-gray-500 flex-wrap gap-2">
                    <span
                      className="
                        inline-flex items-center
                        bg-red-500/10
                        text-red-600
                        px-4 py-1.5
                        rounded-[8px]
                        text-xs md:text-sm
                        font-semibold
                        uppercase
                        backdrop-blur-sm
                        border border-red-500/20
                      "
                    >
                      {item.cat || "General"}
                    </span>

                    <time dateTime={item.date}>
                      {item.date}
                    </time>
                  </footer>
                </article>
              ))
            ) : (
              <p className="w-full text-center text-gray-500">
                No updates yet. Stay tuned!
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;
