import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sponsorsQuery = query(collection(db, 'sponsors'), orderBy('tier', 'asc'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(
      sponsorsQuery,
      (snapshot) => {
        const sponsorsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSponsors(sponsorsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching sponsors:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const groupByTier = (sponsors) => {
    return sponsors.reduce((acc, sponsor) => {
      const tier = sponsor.tier || 'silver';
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(sponsor);
      return acc;
    }, {});
  };

  const tierOrder = ['platinum', 'gold', 'silver'];
  const tierLabels = {
    platinum: 'Platinum Partners',
    gold: 'Gold Partners',
    silver: 'Silver Partners'
  };

  const groupedSponsors = groupByTier(sponsors);

  if (loading) {
    return (
      <section id="sponsors" className="sponsors">
        <div className="sponsors-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading sponsors...</p>
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null; // Don't show section if no sponsors
  }

  return (
    <section id="sponsors" className="sponsors">
      <div className="sponsors-container">
        {/* Header */}
        <div className="sponsors-header">
          <h2>Our Proud Sponsors 🤝</h2>
          <p className="sponsors-tagline">
            Celebrating our amazing partners who make this event possible
          </p>
        </div>

        {/* Sponsor Tiers */}
        {tierOrder.map((tier) => {
          const tierSponsors = groupedSponsors[tier];
          if (!tierSponsors || tierSponsors.length === 0) return null;

          return (
            <div key={tier} className="sponsor-tier">
              {/* Tier Header */}
              <div className="tier-header">
                <div className={`tier-badge ${tier}`}>
                  {tierLabels[tier]}
                </div>
              </div>

              {/* Sponsor Grid */}
              <div className={`sponsor-grid ${tier}`}>
                {tierSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className={`sponsor-card ${tier}`}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="sponsor-logo"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA Section */}
        <div className="sponsors-cta">
          <h3>Want to Sponsor Our Event?</h3>
          <p>
            Join our family of sponsors and get your brand in front of thousands of students
          </p>
          <a href="#contact" className="sponsor-cta-btn">
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;