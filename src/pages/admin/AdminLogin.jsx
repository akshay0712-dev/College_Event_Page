import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/admin');
    } catch (err) {
      console.error("Firebase Auth Error:", err.code);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        default:
          setError(`Error: ${err.code.replace('auth/', '').replace(/-/g, ' ')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-3xl mb-6 shadow-xl">
              <i className="fa-solid fa-lock-open text-3xl text-black"></i>
            </div>
            <h1 className="text-4xl font-black text-white">Admin Access</h1>
            <p className="text-gray-500 mt-3 text-xs font-bold uppercase">GEC Kishanganj • Organizer Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase">Email</label>
              <input
                type="email"
                required
                className="block w-full px-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="admin@geckishanganj.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase">Password</label>
              <input
                type="password"
                required
                className="block w-full px-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-all"
            >
              {loading ? 'Loading...' : 'Unlock Dashboard'}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <a href="/" className="text-gray-600 hover:text-amber-500 text-xs font-bold">
              Return to Public Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;