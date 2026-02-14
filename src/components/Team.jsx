import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Team = () => {
  const [coreTeam, setCoreTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamCollection = collection(db, "team");
    const q = query(teamCollection, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const teamData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoreTeam(teamData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching team:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="team" className="py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400 animate-pulse">
            Loading team...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Meet the Committee 🎓
          </h2>
          <p className="text-gray-500">
            The faces behind an unforgettable fresher party
          </p>
        </header>

        {coreTeam.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-8">
            {coreTeam.map((member) => (
              <li
                key={member.id}
                className="
                  w-full
                  sm:w-[45%]
                  lg:w-[22%]
                  text-center
                  p-6
                  rounded-2xl
                  border border-[#212121]
                  transition duration-300
                  hover:-translate-y-2
                  hover:shadow-xl
                "
              >
                <img
                  src={member.img || "https://via.placeholder.com/80"}
                  alt={member.name}
                  loading="lazy"
                  className="
                    w-24 h-24
                    mx-auto
                    rounded-full
                    object-cover
                    mb-4
                    border-4 border-[#212121]
                    shadow-md
                  "
                />

                <h4 className="text-lg font-semibold">
                  {member.name}
                </h4>

                <p className="text-gray-500 text-sm mt-1">
                  {member.role}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No team members added yet.
          </p>
        )}

        <p className="text-center mt-10 text-gray-500">
          Want to be part of the crew?{" "}
          <a
            href="#contact"
            className="text-red-600 font-semibold hover:underline"
          >
            Join as a Volunteer
          </a>
        </p>
      </div>
    </section>
  );
};

export default Team;
