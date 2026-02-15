import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[80vw]  md:w-auto">
      <div className="relative">
        {/* Glow Effect */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-2xl opacity-40 rounded-full "></div> */}

        {/* Navbar Container */}
        <div
          className="relative flex justify-between items-center gap-8 px-8 py-3 
                        bg-black/60 backdrop-blur-xl 
                        border border-white/10 
                        rounded-full shadow-2xl h-[8vh]"
        >
          {/* Logo */}
          <a
            href="#top"
            className="text-white font-bold text-lg tracking-wide text-nowrap "
          >
            🎭 Freshers' Night
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
            <a href="#about" className="hover:text-pink-400 transition">
              About
            </a>
            <a href="#events" className="hover:text-purple-400 transition">
              Events
            </a>
            <a href="#gallery" className="hover:text-orange-400 transition">
              Gallery
            </a>
            <a href="#contact" className="hover:text-pink-400 transition">
              Contact
            </a>

            <a
              href="#tickets"
              className="ml-4 px-5 py-2 rounded-full 
                         bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 
                         text-white font-semibold 
                         hover:scale-105 transition duration-300 text-nowrap"
            >
              Book Pass 🎟️
            </a>
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative md:hidden top-0 left-1/2 -translate-x-1/2 w-full
                 flex flex-col items-center gap-2 text-white mt-1 rounded-3xl 
                 border border-white/10 bg-[#05010b81] px-4 py-6 
                 shadow-[0_20px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl"
    >
      <a
        href="#about"
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 min-h-[52px] bg-white/15 text-white shadow-lg w-[98%]"
      >
        <div>About</div>
        <div className="text-[11px] text-white/50">Tap to View</div>
      </a>

      <a
        href="#events"
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 min-h-[52px] bg-white/15 text-white shadow-lg w-[98%]"
      >
        <div>Event</div>
        <div className="text-[11px] text-white/50">Tap to View</div>
      </a>

      <a
        href="#gallery"
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 min-h-[52px] bg-white/15 text-white shadow-lg w-[98%]"
      >
        <div>Gallery</div>
        <div className="text-[11px] text-white/50">Tap to View</div>
      </a>

      <a
        href="#contact"
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 min-h-[52px] bg-white/15 text-white shadow-lg w-[98%]"
      >
        <div>Contact</div>
        <div className="text-[11px] text-white/50">Tap to View</div>
      </a>

      <a
        href="#tickets"
        onClick={() => setIsOpen(false)}
        className="px-5 py-2 rounded-2xl text-center 
                   bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 
                   font-semibold w-[98%]"
      >
        Book Pass 🎟️
      </a>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
