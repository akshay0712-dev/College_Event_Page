import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative text-gray-400 ">
      {/* Background Map */}
      <div className="absolute inset-0">
        <iframe
          title="map"
          
          frameBorder="0"
          scrolling="no"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4248.326003415768!2d87.93653137595263!3d26.148990192492647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e511d49252272f%3A0x3b19e1b5f2bf4a28!2sGovt.%20Engineering%20College%20Kishanganj!5e1!3m2!1sen!2sin!4v1771104462048!5m2!1sen!2sin" width="800" height="600"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          style={{
            filter: "grayscale(0.8) contrast(1.2) opacity(0.70) ", border: 0
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[100vw] mx-auto px-6 py-24 flex">
        {/* Contact Card */}
        <div className=" w-full md:w-1/2 lg:w-[28%] bg-white/10 backdrop-blur-xs border border-white/20 shadow-2xl rounded-2xl p-8 ml-auto">
          <h2 className="text-white text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="mb-6 text-gray-400">
            Have questions? We’d love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1 text-white">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#21212173] border border-gray-400 rounded px-3 py-2 text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-white">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#21212173] border border-gray-400 rounded px-3 py-2 text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm mb-1 text-white">
                Message
              </label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-[#21212173] border border-gray-400 rounded px-3 py-2 text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-900 outline-none resize-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>

          <p className="text-xs text-gray-200 mt-6">
            📍 Government Engineering Collage Kishanganj
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
