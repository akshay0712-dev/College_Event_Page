import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase/config"; 
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

const JuniorRegistration = () => {
  const navigate = useNavigate();
  
  // FORM DATA STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    branch: '',
    rollNo: '',
    regNo: ''
  });

  // UI STATES
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // INPUT HANDLER
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(""); 
  };

  // FIREBASE SUBMISSION WITH DUPLICATE CHECK
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const registrationsRef = collection(db, "registrations");

      // 1. CHECK FOR DUPLICATES (Email, Roll, and Reg)
      const qEmail = query(registrationsRef, where("email", "==", formData.email));
      const qRoll = query(registrationsRef, where("rollNo", "==", formData.rollNo));
      const qReg = query(registrationsRef, where("regNo", "==", formData.regNo));

      const [emailSnap, rollSnap, regSnap] = await Promise.all([
        getDocs(qEmail),
        getDocs(qRoll),
        getDocs(qReg)
      ]);

      if (!emailSnap.empty) throw new Error("This Email is already registered!");
      if (!rollSnap.empty) throw new Error("This Roll Number is already registered!");
      if (!regSnap.empty) throw new Error("This Registration Number is already registered!");

      // 2. SAVE TO FIREBASE
      await addDoc(registrationsRef, {
        ...formData,
        role: "junior",
        status: "confirmed",
        createdAt: serverTimestamp(),
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error("Submission Error:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS VIEW (Digital Pass Assurance)
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.4)]">
            <span className="text-4xl font-bold font-sans">✓</span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Identity Secured</h1>
          <p className="text-zinc-400">
            Welcome to the party, <span className="text-white font-bold">{formData.name}</span>.
          </p>
          <div className="bg-zinc-900 border border-red-900/30 p-6 rounded-2xl">
            <p className="text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-2 font-sans">Next Step</p>
            <p className="text-zinc-200 text-sm leading-relaxed italic">
              "Digital passes will be sent to your registered email ({formData.email}) shortly."
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 hover:border-red-600 pb-1 font-sans"
          >
            Return to Event Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Navigation / Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">F</div>
          <span className="font-bold tracking-tight text-xl text-white">FRESHERS<span className="text-red-600">25</span></span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-800 px-4 py-2 rounded-full bg-zinc-900/50"
        >
          Back to Event
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Info */}
        <div className="space-y-8">
          <div>
            <span className="text-red-500 font-semibold tracking-widest text-xs uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Student Registration
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mt-6 leading-tight">
              Join the <span className="text-red-600">Cultural</span> Night of the Year.
            </h1>
            <p className="text-zinc-400 mt-6 text-lg leading-relaxed max-w-md">
              Complete your registration to secure your digital pass. Make sure your university details are correct as per your ID card.
            </p>
          </div>

          <div className="grid gap-6 border-t border-zinc-800 pt-8 mt-8">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center text-red-500 italic">!</div>
              <p className="text-sm text-zinc-400">Digital passes will be sent to your registered email.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Structured Form */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl relative overflow-hidden">
          
          {/* Duplicate Error Alert */}
          {errorMsg && (
            <div className="mb-6 bg-red-600/10 border border-red-600/50 text-red-500 p-3 rounded-lg text-sm text-center font-bold font-sans">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <input 
                name="name" type="text" placeholder="John Doe" required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:ring-2 focus:ring-red-600/50 focus:border-red-600 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">College Email</label>
                <input 
                  name="email" type="email" placeholder="john@university.edu" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:border-red-600 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Contact Number</label>
                <input 
                  name="contact" type="tel" placeholder="+91 00000 00000" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:border-red-600 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Branch</label>
              <select 
                name="branch" required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:border-red-600 outline-none transition-all cursor-pointer text-zinc-400"
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                <option value="cse">Computer Science (CSE)</option>
                <option value="aiml">AI & Machine Learning</option>
                <option value="civil">Civil Engineering</option>
                <option value="ece">Electronics (ECE)</option>
                <option value="ee">Electrical (EE)</option>
                <option value="mech">Mechanical</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Roll No.</label>
                <input 
                  name="rollNo" type="text" placeholder="21XXXX" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:border-red-600 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Registration No.</label>
                <input 
                  name="regNo" type="text" placeholder="REG-XXX" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 focus:border-red-600 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-zinc-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]`}
            >
              {loading ? "Checking Identity..." : "Confirm Registration"}
            </button>

            <p className="text-center text-xs text-zinc-500 leading-relaxed">
              By registering, you agree to follow the campus code of conduct during the event.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JuniorRegistration;