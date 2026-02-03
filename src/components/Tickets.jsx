import React from 'react';

const ticketTypes = [
  {
    name: 'Entry Pass',
    price: '₹299',
    features: [
      'Entry to Fresher Party',
      'DJ Night & Dance Floor',
      'Unlimited Fun',
    ],
    featured: false,
  },
  {
    name: 'Couple Pass',
    price: '₹499',
    features: [
      'Entry for 2 People',
      'DJ + Dance Floor',
      'Free Soft Drinks',
      'Photo Booth Access',
    ],
    featured: true,
  },
  {
    name: 'VIP Pass',
    price: '₹999',
    features: [
      'VIP Entry',
      'Premium Seating Area',
      'Complimentary Snacks',
      'Meet the Organizers',
    ],
    featured: false,
  },
];

const Tickets = () => {
  return (
    <section
      id="tickets"
      className="section tickets animate-on-scroll"
    >
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party Passes 🎉</h2>
          <p className="section-tagline">
            Choose your vibe & party your way
          </p>
        </header>

        <div className="ticket-grid">
          {ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className={`ticket-card ${
                ticket.featured ? 'featured' : ''
              }`}
            >
              {/* Badge */}
              {ticket.featured && (
                <span className="ticket-badge">
                  Most Popular
                </span>
              )}

              {/* Title */}
              <h3>{ticket.name}</h3>

              {/* Price */}
              <div className="ticket-price">
                {ticket.price}
              </div>

              {/* Features */}
              <ul>
                {ticket.features.map((feature, i) => (
                  <li key={i}>✨ {feature}</li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`btn ${
                  ticket.featured
                    ? 'btn-accent'
                    : 'btn-outline'
                }`}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: 'var(--muted)',
          }}
        >
          📍 Venue: College Auditorium &nbsp; | &nbsp;
          🕘 Time: 7 PM onwards
        </p>
      </div>
    </section>
  );
};

export default Tickets;
