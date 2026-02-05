import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Tickets = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ticketsCollection = collection(db, 'tickets');
    const q = query(ticketsCollection, orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ticketsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTicketTypes(ticketsData);
        setLoading(false);
      }, 
      (err) => {
        console.error("Firestore Error:", err);
        onSnapshot(ticketsCollection, (fallbackSnapshot) => {
          const fallbackData = fallbackSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
          }));
          setTicketTypes(fallbackData);
          setLoading(false);
        });
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="section tickets">
        <div className="container flex justify-center py-20">
          <p className="ml-4 text-gray-400">Loading Passes...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tickets" className="section tickets animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party Passes 🎉</h2>
          <p className="section-tagline">Choose your vibe & party your way</p>
        </header>

        <div className="ticket-grid">
          {ticketTypes.length > 0 ? (
            ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-card ${ticket.featured ? 'featured' : ''}`}
              >
                {ticket.featured && (
                  <span className="ticket-badge">Most Popular</span>
                )}

                <h3>{ticket.name || 'Fresher Pass'}</h3>

                <div className="ticket-price">
                  {ticket.price 
                    ? (typeof ticket.price === 'string' && ticket.price.includes('₹') 
                        ? ticket.price 
                        : `₹${ticket.price}`)
                    : 'Free'}
                </div>

                <ul>
                  {ticket.features && Array.isArray(ticket.features) ? (
                    ticket.features.map((feature, i) => (
                      <li key={i}>✨ {feature}</li>
                    ))
                  ) : (
                    <li>✨ Entry to Event</li>
                  )}
                </ul>

                <button className={`btn ${ticket.featured ? 'btn-accent' : 'btn-outline'}`}>
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 italic">No tickets found. Please add them via Admin.</p>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          📍 Venue: College Auditorium &nbsp; | &nbsp; 🕘 Time: 7 PM onwards
        </p>
      </div>
    </section>
  );
};

export default Tickets;