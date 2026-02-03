import React from 'react';

const faqs = [
  {
    q: '📍 Where is the fresher party happening?',
    a: 'The fresher party will be held in the College Auditorium & Open Lawn area. Direction boards will be placed inside the campus so you won’t get lost 😉',
  },
  {
    q: '⏰ What time does the party start?',
    a: 'The party kicks off at 7:00 PM sharp and goes on till 11:30 PM. Please try to arrive on time so you don’t miss the opening dance & DJ entry!',
  },
  {
    q: '🎟️ Do I need to carry a physical ticket?',
    a: 'Nope! Just show your digital pass on your phone at the entry gate. Easy and paper-free 📱',
  },
  {
    q: '👗 Is there any dress code?',
    a: 'Yes! The theme is “Smart Party Wear”. Dress sharp, feel confident, and be ready for tons of photos 📸✨',
  },
  {
    q: '🕺 Can I bring my friends?',
    a: 'Of course! Friends are welcome as long as they have a valid entry pass. Couple passes are available too 💃',
  },
  {
    q: '🍔 Will food & drinks be available?',
    a: 'Yes! Snacks and soft drinks will be available inside the venue. VIP pass holders get complimentary treats 😋',
  },
  {
    q: '🎶 What kind of music will be played?',
    a: 'Expect a mix of Bollywood, Punjabi beats, EDM, and trending party tracks — something for everyone 🔊🔥',
  },
  {
    q: '🔐 Is the event safe?',
    a: 'Absolutely! The venue will have security staff and volunteers to ensure a safe and fun environment for everyone.',
  },
  {
    q: '❌ What if I can’t attend after booking?',
    a: 'Tickets are non-refundable, but you can transfer your pass to a friend before the event.',
  },
  {
    q: '📞 Whom should I contact for help?',
    a: 'You can reach out to the organizing committee via the Contact section or directly talk to any volunteer at the venue.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section faq animate-on-scroll">
      <div className="container">
        <header className="section-header">
          <h2>Fresher Party FAQs 🎉</h2>
          <p className="section-tagline">
            Everything you need to know before the party starts!
          </p>
        </header>

        <div className="faq-groups accordion">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">
                {faq.q}
              </summary>
              <p className="faq-answer">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
