import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

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
  const [errorMsg, setErrorMsg] = useState('');

  // INPUT HANDLER
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  // FIREBASE SUBMISSION WITH DUPLICATE CHECK
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const registrationsRef = collection(db, 'registrations');

      // 1. CHECK FOR DUPLICATES
      const qEmail = query(registrationsRef, where('email', '==', formData.email));
      const qRoll  = query(registrationsRef, where('collegeRollNo', '==', formData.rollNo));
      const qReg   = query(registrationsRef, where('registrationNo', '==', formData.regNo));

      const [emailSnap, rollSnap, regSnap] = await Promise.all([
        getDocs(qEmail),
        getDocs(qRoll),
        getDocs(qReg)
      ]);

      if (!emailSnap.empty) throw new Error('This Email is already registered!');
      if (!rollSnap.empty)  throw new Error('This Roll Number is already registered!');
      if (!regSnap.empty)   throw new Error('This Registration Number is already registered!');

      // 2. SAVE TO FIREBASE — field names match Dashboard expectations
      await addDoc(registrationsRef, {
        fullName:        formData.name,      // Dashboard reads fullName
        email:           formData.email,
        phone:           formData.contact,   // Dashboard reads phone
        branch:          formData.branch,
        collegeRollNo:   formData.rollNo,    // Dashboard reads collegeRollNo
        registrationNo:  formData.regNo,     // Dashboard reads registrationNo
        gender:          '',                 // optional — leave blank
        utrNumber:       '',                 // optional — filled later if needed
        profileUrl:      '',
        paymentUrl:      '',
        role:            'junior',
        status:          'pending',          // pending → admin verifies → email sent
        createdAt:       serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Submission Error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS / THANK YOU SCREEN ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6">

          {/* Animated checkmark */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradienta-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)]">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              Registration Received!
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Thank you, <span className="text-white font-bold">{formData.name}</span> 🎉
            </p>
          </div>

          {/* Main message card */}
          <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📧</span>
              <div>
                <p className="text-white font-bold text-sm">Digital Pass via Email</p>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  Your digital pass will be sent to{' '}
                  <span className="text-green-400 font-semibold">{formData.email}</span>{' '}
                  within a few hours by our team.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex items-start gap-3">
              <span className="text-2xl mt-0.5">⏳</span>
              <div>
                <p className="text-white font-bold text-sm">Under Review</p>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  Our team is verifying your registration. You'll receive a confirmation email once approved.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex items-start gap-3">
              <span className="text-2xl mt-0.5">📁</span>
              <div>
                <p className="text-white font-bold text-sm">Check Your Spam Folder</p>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  Sometimes emails land in spam. Please whitelist our email if you don't see it in your inbox.
                </p>
              </div>
            </div>
          </div>

          {/* Registration summary */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-sm text-left">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3 font-semibold">Your Details</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-zinc-500 text-xs">Branch</span>
                <p className="text-white font-medium capitalize">{formData.branch}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Roll No</span>
                <p className="text-white font-medium">{formData.rollNo}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Contact</span>
                <p className="text-white font-medium">{formData.contact}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Reg No</span>
                <p className="text-white font-medium">{formData.regNo}</p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-400 text-xs leading-relaxed">
              🔔 If you don't receive your pass within 24 hours, please contact the event coordinators directly.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 hover:border-green-500 pb-1"
          >
            ← Return to Event Page
          </button>
        </div>
      </div>
    );
  }

  // ── REGISTRATION FORM ──
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-500/30">

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">F</div>
          <span className="font-bold tracking-tight text-xl text-white">
            FRESHERS<span className="text-red-600">25</span>
          </span>
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
            {[
              { icon: '📝', title: 'Fill the Form', desc: 'Enter your accurate university details.' },
              { icon: '⏳', title: 'Admin Verification', desc: 'Our team reviews your registration within a few hours.' },
              { icon: '📧', title: 'Get Your Pass', desc: 'Digital pass sent to your registered email upon approval.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center text-lg">
                  {step.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{step.title}</p>
                  <p className="text-sm text-zinc-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 bg-red-600/10 border border-red-600/50 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-600 focus:ring-2 focus:ring-red-600/50 focus:border-red-600 outline-none transition-all"
              />
            </div>

            {/* Email + Contact */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">College Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@university.edu"
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-600 focus:border-red-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Contact Number</label>
                <input
                  name="contact"
                  type="tel"
                  placeholder="+91 00000 00000"
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-600 focus:border-red-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Branch</label>
              <select
                name="branch"
                required
                onChange={handleChange}
                defaultValue=""
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-400 focus:border-red-600 outline-none transition-all cursor-pointer"
              >
                <option value="" disabled>Select Branch</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="AIML">AI &amp; Machine Learning (AIML)</option>
                <option value="Civil">Civil Engineering</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="EE">Electrical (EE)</option>
                <option value="Mechanical">Mechanical Engineering</option>
              </select>
            </div>

            {/* Roll No + Reg No */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Roll No.</label>
                <input
                  name="rollNo"
                  type="text"
                  placeholder="21XXXX"
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-600 focus:border-red-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Registration No.</label>
                <input
                  name="regNo"
                  type="text"
                  placeholder="REG-XXXX"
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-600 focus:border-red-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? 'bg-zinc-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:scale-[0.98]'
              } text-white font-bold py-4 rounded-xl mt-2 transition-all shadow-lg shadow-red-600/20`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Checking & Submitting...
                </span>
              ) : (
                'Confirm Registration →'
              )}
            </button>

            <p className="text-center text-xs text-zinc-500 leading-relaxed">
              By registering, you agree to follow the campus code of conduct during the event.
              Your pass will be emailed after admin verification.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JuniorRegistration;