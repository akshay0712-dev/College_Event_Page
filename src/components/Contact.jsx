import React from 'react';

const faqs = [
  {
    q: '📍 Where is the fresher party happening?',
    a: 'The fresher party will be held in the College Auditorium & Open Lawn area.',
  },
  {
    q: '⏰ What time does the party start?',
    a: 'The party kicks off at 7:00 PM sharp and goes on till 11:30 PM.',
  },
  {
    q: '🎟️ Do I need to carry a physical ticket?',
    a: 'Nope! Just show your digital pass on your phone at the entry gate.',
  },
  {
    q: '👗 Is there any dress code?',
    a: 'Yes! The theme is "Smart Party Wear". Dress sharp and be camera-ready!',
  },
  {
    q: '🕺 Can I bring my friends?',
    a: 'Of course! Friends are welcome as long as they have a valid entry pass.',
  },
  {
    q: '🍔 Will food & drinks be available?',
    a: 'Yes! Snacks and soft drinks will be available. VIP pass holders get complimentary treats.',
  },
  {
    q: '🎶 What kind of music will be played?',
    a: 'Expect a mix of Bollywood, Punjabi beats, EDM, and trending party tracks.',
  },
  {
    q: '🔐 Is the event safe?',
    a: 'Absolutely! We have security staff and volunteers to ensure a safe environment.',
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