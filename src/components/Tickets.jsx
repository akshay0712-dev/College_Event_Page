import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const Tickets = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const ticketsCollection = collection(db, "tickets");
    const q = query(ticketsCollection, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
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
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
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
      <section className="py-20">
        <div className="max-w-6xl mx-auto flex justify-center">
          <p className="text-gray-400 animate-pulse">Loading Passes...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tickets" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Fresher Party Passes 🎉
          </h2>
          <p className="text-gray-500">
            Choose your vibe & party your way
          </p>
        </header>

        {/* FLEX WRAPPER */}
        <div className="flex flex-wrap justify-center gap-8">
          {ticketTypes.length > 0 ? (
            ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className={` w-full sm:w-[45%] lg:w-[30%] relative border rounded-2xl p-8 flex flex-col transition duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden
                  ${
                    ticket.featured
                      ? "border-red-500 shadow-lg"
                      : "border-gray-200"
                  }
                `}
              >
                {ticket.featured && (
                  <span className="ticket-badge">Most Popular</span>
                )}
                <h3 className="text-xl font-semibold mb-4">
                  {ticket.name || "Fresher Pass"}
                </h3>

                <div className="text-3xl font-bold text-red-600 mb-6">
                  {ticket.price
                    ? typeof ticket.price === "string" &&
                      ticket.price.includes("₹")
                      ? ticket.price
                      : `₹${ticket.price}`
                    : "Free"}
                </div>

                <ul className="space-y-3 text-white mb-6">
                  {ticket.features && Array.isArray(ticket.features) ? (
                    ticket.features.map((feature, i) => (
                      <li key={i}>✨ {feature}</li>
                    ))
                  ) : (
                    <li>✨ Entry to Event</li>
                  )}
                </ul>

                <button
                  onClick={() => navigate('/booknow')}
                  className={`
                    mt-auto
                    py-3
                    rounded-lg
                    font-semibold
                    transition
                    ${
                      ticket.featured
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10">
              <p className="text-gray-500 italic">
                No tickets found. Please add them via Admin.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-gray-500 text-sm">
          📍 Venue: College Auditorium &nbsp; | &nbsp; 🕘 Time: 7 PM onwards
        </p>
      </div>
    </section>
  );
};

export default Tickets;
