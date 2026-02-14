import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-950 to-black text-gray-400">

      {/* Top Glow Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-wrap justify-between gap-14">

          {/* Brand */}
          <div className="w-full md:w-[38%] space-y-5">
            <h2 className="text-3xl font-bold text-white">
              🎭 Freshers' Night
            </h2>

            <p className="text-red-500 font-medium tracking-wide">
              GEC Kishanganj • 2026 Edition
            </p>

            <p className="text-gray-500 leading-relaxed max-w-md">
              One night. One stage. One unforgettable beginning.
              Celebrating the arrival of the Class of 2025 with music,
              lights, and lifelong memories.
            </p>
          </div>

          {/* Links */}
          <div className="w-full sm:w-[45%] md:w-[20%]">
            <h4 className="text-white font-semibold mb-6 tracking-wider uppercase text-sm">
              Navigate
            </h4>

            <ul className="space-y-4 text-sm">
              {["About", "Events", "Gallery", "Tickets", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="hover:text-red-500 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social + CTA */}
          <div className="w-full sm:w-[45%] md:w-[28%] space-y-6">

            <h4 className="text-white font-semibold tracking-wider uppercase text-sm">
              Stay Connected
            </h4>

            <div className="flex gap-4">

              {/* Facebook */}
              <a href="#" className="group">
                <div className="w-11 h-11 flex items-center justify-center rounded-full 
                                bg-white/5 border border-white/10
                                transition duration-300
                                group-hover:border-[#1877F2] group-hover:bg-[#1877F2]/10">
                  <i className="fa-brands fa-facebook text-lg 
                                 transition group-hover:text-[#1877F2]"></i>
                </div>
              </a>

              {/* Instagram */}
              <a href="#" className="group">
                <div className="w-11 h-11 flex items-center justify-center rounded-full 
                                bg-white/5 border border-white/10
                                transition duration-300
                                group-hover:border-pink-500 group-hover:bg-pink-500/10">
                  <i className="fa-brands fa-instagram text-lg 
                                 transition group-hover:text-pink-500"></i>
                </div>
              </a>

              {/* Twitter */}
              <a href="#" className="group">
                <div className="w-11 h-11 flex items-center justify-center rounded-full 
                                bg-white/5 border border-white/10
                                transition duration-300
                                group-hover:border-[#1DA1F2] group-hover:bg-[#1DA1F2]/10">
                  <i className="fa-brands fa-twitter text-lg 
                                 transition group-hover:text-[#1DA1F2]"></i>
                </div>
              </a>

            </div>

            {/* CTA Button */}
            <a
              href="#tickets"
              className="inline-block mt-4 px-6 py-3 rounded-full 
                         bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500
                         text-white font-semibold
                         hover:scale-105 transition duration-300"
            >
              Book Your Pass 🎟️
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
        <p>© 2026 GEC Kishanganj. All rights reserved.</p>
        <p>
          Designed & Built with <span className="text-pink-400">❤️</span> by the Organizing Committee
        </p>
      </div>
    </footer>
  );
};

export default Footer;
