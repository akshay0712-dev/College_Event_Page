import React, { useState } from "react";

const faqs = [
  {
    q: "📍 Where is the fresher party happening?",
    a: "The fresher party will be held in the College Auditorium & Open Lawn area.",
  },
  {
    q: "⏰ What time does the party start?",
    a: "The party kicks off at 7:00 PM sharp and goes on till 11:30 PM.",
  },
  {
    q: "🎟️ Do I need to carry a physical ticket?",
    a: "Nope! Just show your digital pass on your phone at the entry gate.",
  },
  {
    q: "👗 Is there any dress code?",
    a: 'Yes! The theme is "Smart Party Wear". Dress sharp and be camera-ready!',
  },
  {
    q: "🕺 Can I bring my friends?",
    a: "Of course! Friends are welcome as long as they have a valid entry pass.",
  },
  {
    q: "🍔 Will food & drinks be available?",
    a: "Yes! Snacks and soft drinks will be available. VIP pass holders get complimentary treats.",
  },
  {
    q: "🎶 What kind of music will be played?",
    a: "Expect a mix of Bollywood, Punjabi beats, EDM, and trending party tracks.",
  },
  {
    q: "🔐 Is the event safe?",
    a: "Absolutely! We have security staff and volunteers to ensure a safe environment.",
  },
];

const FAQ = () => {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setMessage("⚠️ Please enter your question.");
      return;
    }

    // Here you can connect to backend / firebase later
    setMessage("✅ Thanks! We'll get back to you soon.");
    setQuestion("");

    // Auto remove message
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };
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
              <summary className="faq-question">{faq.q}</summary>
              <p className="faq-answer">{faq.a}</p>
            </details>
          ))}
        </div>
        {/* Ask Question Section */}
        <div className="mt-6  border border-white/10 rounded-2xl p-6 backdrop-blur-xl max-w-[800px] mx-auto">
          <h3 className="text-xl font-semibold mb-4">
            Didn’t find your question? 🤔
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question here..."
              className="px-4 py-3 rounded-xl b border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition"
            />

            <button
              type="submit"
              className="self-start px-6 py-3 rounded-xl
                         bg-white text-black font-semibold
                         hover:bg-gray-200 transition"
            >
              Ask Question
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
