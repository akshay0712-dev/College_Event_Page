import React, { useState } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('heroEvents');
  const [loading, setLoading] = useState(false);

  // Hero Events State
  const [heroEvent, setHeroEvent] = useState({
    title: '',
    date: '',
    location: '',
    eventDateTime: '',
    backgroundImage: '',
  });

  // Tickets State
  const [ticket, setTicket] = useState({
    name: '',
    price: '',
    features: '',
    featured: false
  });

  // News State
  const [news, setNews] = useState({
    title: '',
    cat: 'Announcement'
  });

  // Events Timeline State
  const [event, setEvent] = useState({
    title: '',
    time: '',
    desc: '',
    icon: 'fa-star',
    order: 1
  });

  // Speakers State
  const [speaker, setSpeaker] = useState({
    name: '',
    role: '',
    img: '',
    order: 1
  });

  // Team State
  const [teamMember, setTeamMember] = useState({
    name: '',
    role: '',
    img: '',
    order: 1
  });

  // Gallery State
  const [galleryImage, setGalleryImage] = useState({
    url: '',
    alt: '',
    category: 'party'
  });

  // Add Hero Event
  const handleAddHeroEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventDate = new Date(heroEvent.eventDateTime);
      await addDoc(collection(db, 'heroEvents'), {
        title: heroEvent.title,
        date: heroEvent.date,
        location: heroEvent.location,
        eventDate: Timestamp.fromDate(eventDate),
        backgroundImage: heroEvent.backgroundImage,
        status: 'upcoming',
        createdAt: serverTimestamp()
      });
      alert('🎉 Hero Event Added!');
      setHeroEvent({ title: '', date: '', location: '', eventDateTime: '', backgroundImage: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding event');
    }
    setLoading(false);
  };

  // Add Ticket
  const handleAddTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuresArray = ticket.features.split(',').map(f => f.trim());
      await addDoc(collection(db, 'tickets'), {
        name: ticket.name,
        price: ticket.price,
        features: featuresArray,
        featured: ticket.featured,
        createdAt: serverTimestamp()
      });
      alert('🎫 Ticket Added!');
      setTicket({ name: '', price: '', features: '', featured: false });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Add News
  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'news'), {
        title: news.title,
        cat: news.cat,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        createdAt: serverTimestamp()
      });
      alert('📰 News Posted!');
      setNews({ title: '', cat: 'Announcement' });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Add Event Timeline
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: event.title,
        time: event.time,
        desc: event.desc,
        icon: event.icon,
        order: Number(event.order)
      });
      alert('⏰ Timeline Event Added!');
      setEvent({ title: '', time: '', desc: '', icon: 'fa-star', order: 1 });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Add Speaker
  const handleAddSpeaker = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'speakers'), {
        name: speaker.name,
        role: speaker.role,
        img: speaker.img,
        order: Number(speaker.order),
        createdAt: serverTimestamp()
      });
      alert('🎤 Speaker Added!');
      setSpeaker({ name: '', role: '', img: '', order: 1 });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Add Team Member
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'team'), {
        name: teamMember.name,
        role: teamMember.role,
        img: teamMember.img,
        order: Number(teamMember.order),
        createdAt: serverTimestamp()
      });
      alert('👥 Team Member Added!');
      setTeamMember({ name: '', role: '', img: '', order: 1 });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Add Gallery Image
  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        url: galleryImage.url,
        alt: galleryImage.alt,
        category: galleryImage.category,
        createdAt: serverTimestamp()
      });
      alert('📸 Photo Added!');
      setGalleryImage({ url: '', alt: '', category: 'party' });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-amber-500">🎉 Fresher Party Admin</h1>
            <p className="text-gray-500 text-sm mt-1">GEC Kishanganj • Event Dashboard</p>
          </div>
          <button 
            onClick={() => auth.signOut()} 
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
          >
            LOGOUT
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {['heroEvents', 'tickets', 'news', 'events', 'speakers', 'team', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab === 'heroEvents' && '🎯 Hero'}
              {tab === 'tickets' && '🎫 Tickets'}
              {tab === 'news' && '📰 News'}
              {tab === 'events' && '⏰ Timeline'}
              {tab === 'speakers' && '🎤 Speakers'}
              {tab === 'team' && '👥 Team'}
              {tab === 'gallery' && '📸 Gallery'}
            </button>
          ))}
        </div>

        {/* Forms Container */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          
          {/* HERO EVENTS FORM */}
          {activeTab === 'heroEvents' && (
            <form onSubmit={handleAddHeroEvent} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">🎯 Add Hero Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                  <input
                    type="text"
                    placeholder="GEC Fresher Party 2026"
                    value={heroEvent.title}
                    onChange={(e) => setHeroEvent({...heroEvent, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Display Date</label>
                  <input
                    type="text"
                    placeholder="March 15, 2026"
                    value={heroEvent.date}
                    onChange={(e) => setHeroEvent({...heroEvent, date: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Location</label>
                  <input
                    type="text"
                    placeholder="College Auditorium"
                    value={heroEvent.location}
                    onChange={(e) => setHeroEvent({...heroEvent, location: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Event Date/Time</label>
                  <input
                    type="datetime-local"
                    value={heroEvent.eventDateTime}
                    onChange={(e) => setHeroEvent({...heroEvent, eventDateTime: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Background Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={heroEvent.backgroundImage}
                    onChange={(e) => setHeroEvent({...heroEvent, backgroundImage: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '🚀 Create Event'}
              </button>
            </form>
          )}

          {/* TICKETS FORM */}
          {activeTab === 'tickets' && (
            <form onSubmit={handleAddTicket} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">🎫 Add Ticket</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Pass Name</label>
                  <input
                    type="text"
                    placeholder="Entry Pass"
                    value={ticket.name}
                    onChange={(e) => setTicket({...ticket, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Price</label>
                  <input
                    type="text"
                    placeholder="₹500"
                    value={ticket.price}
                    onChange={(e) => setTicket({...ticket, price: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Features (comma separated)</label>
                  <textarea
                    placeholder="Entry, Welcome Drink, DJ Access"
                    value={ticket.features}
                    onChange={(e) => setTicket({...ticket, features: e.target.value})}
                    rows="3"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={ticket.featured}
                    onChange={(e) => setTicket({...ticket, featured: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <label htmlFor="featured" className="text-sm">Featured (Most Popular)</label>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '✨ Add Ticket'}
              </button>
            </form>
          )}

          {/* NEWS FORM */}
          {activeTab === 'news' && (
            <form onSubmit={handleAddNews} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">📰 Post News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Category</label>
                  <select
                    value={news.cat}
                    onChange={(e) => setNews({...news, cat: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  >
                    <option>Announcement</option>
                    <option>Alert</option>
                    <option>Food</option>
                    <option>DJ Night</option>
                    <option>Games</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                  <textarea
                    placeholder="DJ Night starts in 10 minutes!"
                    value={news.title}
                    onChange={(e) => setNews({...news, title: e.target.value})}
                    rows="3"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Posting...' : '📢 Broadcast'}
              </button>
            </form>
          )}

          {/* EVENTS TIMELINE FORM */}
          {activeTab === 'events' && (
            <form onSubmit={handleAddEvent} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">⏰ Add Timeline Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Time</label>
                  <input
                    type="text"
                    placeholder="7:00 PM"
                    value={event.time}
                    onChange={(e) => setEvent({...event, time: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                  <input
                    type="text"
                    placeholder="Entry & Welcome"
                    value={event.title}
                    onChange={(e) => setEvent({...event, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Icon</label>
                  <input
                    type="text"
                    placeholder="fa-music"
                    value={event.icon}
                    onChange={(e) => setEvent({...event, icon: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                  <input
                    type="number"
                    value={event.order}
                    onChange={(e) => setEvent({...event, order: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Description</label>
                  <input
                    type="text"
                    placeholder="Brief details..."
                    value={event.desc}
                    onChange={(e) => setEvent({...event, desc: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '🎯 Add Event'}
              </button>
            </form>
          )}

          {/* SPEAKERS FORM */}
          {activeTab === 'speakers' && (
            <form onSubmit={handleAddSpeaker} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">🎤 Add Speaker</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Rajesh Kumar"
                    value={speaker.name}
                    onChange={(e) => setSpeaker({...speaker, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Role</label>
                  <input
                    type="text"
                    placeholder="Chief Guest"
                    value={speaker.role}
                    onChange={(e) => setSpeaker({...speaker, role: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={speaker.img}
                    onChange={(e) => setSpeaker({...speaker, img: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                  <input
                    type="number"
                    value={speaker.order}
                    onChange={(e) => setSpeaker({...speaker, order: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '🎤 Add Speaker'}
              </button>
            </form>
          )}

          {/* TEAM FORM */}
          {activeTab === 'team' && (
            <form onSubmit={handleAddTeamMember} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">👥 Add Team Member</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Name</label>
                  <input
                    type="text"
                    placeholder="Prem Prakash"
                    value={teamMember.name}
                    onChange={(e) => setTeamMember({...teamMember, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Role</label>
                  <input
                    type="text"
                    placeholder="Event Coordinator"
                    value={teamMember.role}
                    onChange={(e) => setTeamMember({...teamMember, role: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={teamMember.img}
                    onChange={(e) => setTeamMember({...teamMember, img: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                  <input
                    type="number"
                    value={teamMember.order}
                    onChange={(e) => setTeamMember({...teamMember, order: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '👥 Add Member'}
              </button>
            </form>
          )}

          {/* GALLERY FORM */}
          {activeTab === 'gallery' && (
            <form onSubmit={handleAddGalleryImage} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">📸 Add Photo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={galleryImage.url}
                    onChange={(e) => setGalleryImage({...galleryImage, url: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Description</label>
                  <input
                    type="text"
                    placeholder="DJ Night"
                    value={galleryImage.alt}
                    onChange={(e) => setGalleryImage({...galleryImage, alt: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">Category</label>
                  <select
                    value={galleryImage.category}
                    onChange={(e) => setGalleryImage({...galleryImage, category: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  >
                    <option value="party">Party</option>
                    <option value="dance">Dance</option>
                    <option value="dj">DJ</option>
                    <option value="food">Food</option>
                    <option value="games">Games</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : '📸 Add Photo'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;