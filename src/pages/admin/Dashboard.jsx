import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('heroEvents');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Event Lists for Sidebar
  const [currentEvent, setCurrentEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [linkedItemsCounts, setLinkedItemsCounts] = useState({});

  // Form States
  const [heroEvent, setHeroEvent] = useState({
    title: '',
    date: '',
    location: '',
    eventDateTime: '',
    backgroundImage: '',
    backgroundVideo: ''
  });

  const [ticket, setTicket] = useState({
    name: '',
    price: '',
    features: '',
    featured: false,
    eventId: ''
  });

  const [news, setNews] = useState({
    title: '',
    cat: 'Announcement',
    eventId: ''
  });

  const [event, setEvent] = useState({
    title: '',
    time: '',
    desc: '',
    icon: 'fa-star',
    order: 1,
    eventId: ''
  });

  const [speaker, setSpeaker] = useState({
    name: '',
    role: '',
    img: '',
    order: 1,
    eventId: ''
  });

  const [teamMember, setTeamMember] = useState({
    name: '',
    role: '',
    img: '',
    order: 1,
    eventId: ''
  });

  const [galleryImage, setGalleryImage] = useState({
    url: '',
    alt: '',
    category: 'party',
    eventId: ''
  });

  const [videoHighlight, setVideoHighlight] = useState({
    url: '',
    title: '',
    description: '',
    thumbnail: '',
    orientation: 'landscape',
    order: 1,
    eventId: ''
  });

  // Real-time Event Monitoring
  useEffect(() => {
    const eventsCollection = collection(db, 'heroEvents');
    const now = new Date();

    const currentQuery = query(
      eventsCollection,
      where('eventDate', '>=', now),
      orderBy('eventDate', 'asc')
    );

    const previousQuery = query(
      eventsCollection,
      where('eventDate', '<', now),
      orderBy('eventDate', 'desc')
    );

    const unsubCurrent = onSnapshot(currentQuery, (snapshot) => {
      const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (events.length > 0) {
        setCurrentEvent(events[0]);
        setUpcomingEvents(events.slice(1));
      } else {
        setCurrentEvent(null);
        setUpcomingEvents([]);
      }
    });

    const unsubPrevious = onSnapshot(previousQuery, (snapshot) => {
      const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPreviousEvents(events);
    });

    return () => {
      unsubCurrent();
      unsubPrevious();
    };
  }, []);

  // Count linked items for each event
  useEffect(() => {
    const collections = ['tickets', 'news', 'events', 'speakers', 'team', 'gallery', 'videos'];

    const unsubscribes = collections.map((collectionName) => {
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        const counts = {};

        snapshot.docs.forEach((doc) => {
          const eventId = doc.data().eventId;
          if (eventId) {
            if (!counts[eventId]) counts[eventId] = {};
            if (!counts[eventId][collectionName]) counts[eventId][collectionName] = 0;
            counts[eventId][collectionName]++;
          }
        });

        setLinkedItemsCounts((prev) => {
          const newCounts = { ...prev };
          Object.keys(counts).forEach((eventId) => {
            newCounts[eventId] = { ...(newCounts[eventId] || {}), ...counts[eventId] };
          });
          return newCounts;
        });
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  // Add/Update Hero Event
  const handleAddHeroEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventDate = new Date(heroEvent.eventDateTime);

      const data = {
        title: heroEvent.title,
        date: heroEvent.date,
        location: heroEvent.location,
        eventDate: Timestamp.fromDate(eventDate),
        backgroundImage: heroEvent.backgroundImage || '',
        backgroundVideo: heroEvent.backgroundVideo || '',
        status: 'upcoming',
        updatedAt: serverTimestamp()
      };

      if (editMode && editingId) {
        await updateDoc(doc(db, 'heroEvents', editingId), data);
        alert('✅ Event Updated Successfully!');
        setEditMode(false);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'heroEvents'), {
          ...data,
          createdAt: serverTimestamp()
        });
        alert('🎉 New Event Created!');
      }

      setHeroEvent({
        title: '',
        date: '',
        location: '',
        eventDateTime: '',
        backgroundImage: '',
        backgroundVideo: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err?.message || 'Something went wrong'));
    }
    setLoading(false);
  };

  // Add Ticket
  const handleAddTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuresArray = ticket.features.split(',').map((f) => f.trim()).filter(Boolean);
      await addDoc(collection(db, 'tickets'), {
        name: ticket.name,
        price: ticket.price,
        features: featuresArray,
        featured: ticket.featured,
        eventId: ticket.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('🎫 Ticket Added!');
      setTicket({ name: '', price: '', features: '', featured: false, eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
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
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        eventId: news.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('📰 News Posted!');
      setNews({ title: '', cat: 'Announcement', eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  // Add Timeline Event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: event.title,
        time: event.time,
        desc: event.desc,
        icon: event.icon,
        order: Number(event.order),
        eventId: event.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('⏰ Timeline Event Added!');
      setEvent({ title: '', time: '', desc: '', icon: 'fa-star', order: 1, eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
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
        eventId: speaker.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('🎤 Speaker Added!');
      setSpeaker({ name: '', role: '', img: '', order: 1, eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
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
        eventId: teamMember.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('👥 Team Member Added!');
      setTeamMember({ name: '', role: '', img: '', order: 1, eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
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
        eventId: galleryImage.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('📸 Photo Added!');
      setGalleryImage({ url: '', alt: '', category: 'party', eventId: '' });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  // Add Video Highlight
  const handleAddVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'videos'), {
        url: videoHighlight.url,
        title: videoHighlight.title,
        description: videoHighlight.description || '',
        thumbnail: videoHighlight.thumbnail || '',
        orientation: videoHighlight.orientation,
        order: Number(videoHighlight.order),
        eventId: videoHighlight.eventId || null,
        createdAt: serverTimestamp()
      });
      alert('🎬 Video Added!');
      setVideoHighlight({
        url: '',
        title: '',
        description: '',
        thumbnail: '',
        orientation: 'landscape',
        order: 1,
        eventId: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  // Edit Event Handler
  const handleEditEvent = (eventDoc) => {
    if (!eventDoc?.eventDate || !eventDoc.eventDate.toDate) {
      alert('⚠️ Invalid event data');
      return;
    }

    setEditMode(true);
    setEditingId(eventDoc.id);

    const date = eventDoc.eventDate.toDate();
    const dateTimeLocal = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setHeroEvent({
      title: eventDoc.title || '',
      date: eventDoc.date || '',
      location: eventDoc.location || '',
      eventDateTime: dateTimeLocal,
      backgroundImage: eventDoc.backgroundImage || '',
      backgroundVideo: eventDoc.backgroundVideo || ''
    });

    setActiveTab('heroEvents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Event with Cascade Delete
  const handleDeleteEvent = async (id) => {
    const collections = ['tickets', 'news', 'events', 'speakers', 'team', 'gallery', 'videos'];
    const counts = linkedItemsCounts[id] || {};
    const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0);

    const confirmMessage = totalItems > 0
      ? `⚠️ DELETE EVENT PERMANENTLY?\n\nThis will also delete:\n${Object.entries(counts)
          .map(([col, count]) => `• ${count} ${col}`)
          .join('\n')}\n\nTotal: ${totalItems} linked items\n\nThis CANNOT be undone!`
      : '⚠️ Delete this event permanently?\n\nThis cannot be undone!';

    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading(true);

      // Delete the event
      await deleteDoc(doc(db, 'heroEvents', id));

      // Delete all linked items from all collections
      const deletePromises = collections.map(async (collectionName) => {
        const q = query(collection(db, collectionName), where('eventId', '==', id));
        const snapshot = await getDocs(q);
        const deletes = snapshot.docs.map((docSnap) =>
          deleteDoc(doc(db, collectionName, docSnap.id))
        );
        return Promise.all(deletes);
      });

      await Promise.all(deletePromises);

      alert(
        `🗑️ Event Deleted Successfully!\n\n${
          totalItems > 0 ? `${totalItems} linked items also removed.` : 'No linked items.'
        }`
      );
    } catch (err) {
      console.error(err);
      alert('Error deleting event: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingId(null);
    setHeroEvent({
      title: '',
      date: '',
      location: '',
      eventDateTime: '',
      backgroundImage: '',
      backgroundVideo: ''
    });
  };

  // Format Date
  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    if (ts.toDate) {
      return ts.toDate().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (ts instanceof Date) {
      return ts.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'N/A';
  };

  // Event Selector Component (Reusable)
  const EventSelector = ({ value, onChange, label = 'Link to Event (Optional)' }) => (
    <div className="md:col-span-2">
      <label className="block text-xs text-gray-400 mb-2 uppercase">🔗 {label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
      >
        <option value="">No Event Link (General Item)</option>
        {currentEvent && (
          <option value={currentEvent.id}>🔴 {currentEvent.title} (Current)</option>
        )}
        {upcomingEvents.map((ev) => (
          <option key={ev.id} value={ev.id}>
            ⏭️ {ev.title}
          </option>
        ))}
        {previousEvents.map((ev) => (
          <option key={ev.id} value={ev.id}>
            ⏮️ {ev.title}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        If linked, this item will be auto-deleted when the event is deleted
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* MAIN CONTENT */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-4xl font-bold text-amber-500">🎉 Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">
                  GEC Kishanganj • Event Management System
                </p>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                LOGOUT
              </button>
            </header>

            {/* Migration Alert */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h3 className="text-sm font-bold text-blue-400 mb-2">
                🔄 First Time Setup Required
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Click below to add event linking to all existing data. This only needs to be
                done once.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const { migrateAllCollections } = await import(
                    '../../utils/migrateGallery.js'
                    
                  );
                  await migrateAllCollections();
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold text-sm"
              >
                🔄 Migrate All Collections
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'heroEvents', label: '🎯 Hero Events' },
                { id: 'tickets', label: '🎫 Tickets' },
                { id: 'news', label: '📰 News' },
                { id: 'events', label: '⏰ Timeline' },
                { id: 'videos', label: '🎬 Videos' },
                { id: 'speakers', label: '🎤 Speakers' },
                { id: 'team', label: '👥 Team' },
                { id: 'gallery', label: '📸 Gallery' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Forms Container */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              {/* HERO EVENTS FORM */}
              {activeTab === 'heroEvents' && (
                <form onSubmit={handleAddHeroEvent} className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                      {editMode ? '✏️ Edit Hero Event' : '🎯 Create New Event'}
                    </h2>
                    {editMode && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Event Title
                      </label>
                      <input
                        type="text"
                        placeholder="GEC Fresher Party 2026"
                        value={heroEvent.title}
                        onChange={(e) => setHeroEvent({ ...heroEvent, title: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Display Date
                      </label>
                      <input
                        type="text"
                        placeholder="March 15, 2026"
                        value={heroEvent.date}
                        onChange={(e) => setHeroEvent({ ...heroEvent, date: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="College Auditorium"
                        value={heroEvent.location}
                        onChange={(e) =>
                          setHeroEvent({ ...heroEvent, location: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Event Date/Time (for countdown)
                      </label>
                      <input
                        type="datetime-local"
                        value={heroEvent.eventDateTime}
                        onChange={(e) =>
                          setHeroEvent({ ...heroEvent, eventDateTime: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        🎬 Background Video URL (MP4 recommended)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={heroEvent.backgroundVideo}
                        onChange={(e) =>
                          setHeroEvent({ ...heroEvent, backgroundVideo: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Use Cloudinary, Vimeo, or direct MP4 links
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        🖼️ Background Image URL (Fallback)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={heroEvent.backgroundImage}
                        onChange={(e) =>
                          setHeroEvent({ ...heroEvent, backgroundImage: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : editMode ? '💾 Update Event' : '🚀 Create Event'}
                  </button>
                </form>
              )}

              {/* TICKETS FORM */}
              {activeTab === 'tickets' && (
                <form onSubmit={handleAddTicket} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">🎫 Add Ticket Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Pass Name
                      </label>
                      <input
                        type="text"
                        placeholder="Entry Pass"
                        value={ticket.name}
                        onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
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
                        onChange={(e) => setTicket({ ...ticket, price: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Features (comma separated)
                      </label>
                      <textarea
                        placeholder="Entry, Welcome Drink, DJ Access, Reserved Seating"
                        value={ticket.features}
                        onChange={(e) => setTicket({ ...ticket, features: e.target.value })}
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
                        onChange={(e) => setTicket({ ...ticket, featured: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label htmlFor="featured" className="text-sm">
                        Mark as Featured (Most Popular)
                      </label>
                    </div>
                    <EventSelector
                      value={ticket.eventId}
                      onChange={(val) => setTicket({ ...ticket, eventId: val })}
                    />
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
                  <h2 className="text-2xl font-bold mb-4">📰 Post Announcement</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Category
                      </label>
                      <select
                        value={news.cat}
                        onChange={(e) => setNews({ ...news, cat: e.target.value })}
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
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Title/Message
                      </label>
                      <textarea
                        placeholder="DJ Night starts in 10 minutes! 🎵"
                        value={news.title}
                        onChange={(e) => setNews({ ...news, title: e.target.value })}
                        rows="3"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <EventSelector
                      value={news.eventId}
                      onChange={(val) => setNews({ ...news, eventId: val })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : '📢 Broadcast Now'}
                  </button>
                </form>
              )}

              {/* TIMELINE EVENTS FORM */}
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
                        onChange={(e) => setEvent({ ...event, time: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Event Title
                      </label>
                      <input
                        type="text"
                        placeholder="Entry & Welcome"
                        value={event.title}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Icon (FontAwesome)
                      </label>
                      <input
                        type="text"
                        placeholder="fa-music"
                        value={event.icon}
                        onChange={(e) => setEvent({ ...event, icon: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                      <input
                        type="number"
                        value={event.order}
                        onChange={(e) => setEvent({ ...event, order: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Brief details..."
                        value={event.desc}
                        onChange={(e) => setEvent({ ...event, desc: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <EventSelector
                      value={event.eventId}
                      onChange={(val) => setEvent({ ...event, eventId: val })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : '🎯 Add to Schedule'}
                  </button>
                </form>
              )}

              {/* VIDEO HIGHLIGHTS FORM */}
              {activeTab === 'videos' && (
                <form onSubmit={handleAddVideo} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">🎬 Add Video Highlight</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Video URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        value={videoHighlight.url}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, url: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                      <input
                        type="text"
                        placeholder="DJ Night Highlights"
                        value={videoHighlight.title}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, title: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Orientation</label>
                      <select
                        value={videoHighlight.orientation}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, orientation: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      >
                        <option value="landscape">Landscape (16:9)</option>
                        <option value="portrait">Portrait (9:16)</option>
                        <option value="square">Square (1:1)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Description (Optional)</label>
                      <textarea
                        placeholder="Brief description of the video..."
                        value={videoHighlight.description}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, description: e.target.value })}
                        rows="2"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Thumbnail URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={videoHighlight.thumbnail}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, thumbnail: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Display Order</label>
                      <input
                        type="number"
                        value={videoHighlight.order}
                        onChange={(e) => setVideoHighlight({ ...videoHighlight, order: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <EventSelector
                      value={videoHighlight.eventId}
                      onChange={(val) => setVideoHighlight({ ...videoHighlight, eventId: val })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : '🎬 Add Video'}
                  </button>
                </form>
              )}

              {/* SPEAKERS FORM */}
              {activeTab === 'speakers' && (
                <form onSubmit={handleAddSpeaker} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">🎤 Add Speaker/Guest</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">Name</label>
                      <input
                        type="text"
                        placeholder="Dr. Rajesh Kumar"
                        value={speaker.name}
                        onChange={(e) => setSpeaker({ ...speaker, name: e.target.value })}
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
                        onChange={(e) => setSpeaker({ ...speaker, role: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={speaker.img}
                        onChange={(e) => setSpeaker({ ...speaker, img: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={speaker.order}
                        onChange={(e) => setSpeaker({ ...speaker, order: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <EventSelector
                      value={speaker.eventId}
                      onChange={(val) => setSpeaker({ ...speaker, eventId: val })}
                    />
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
                        onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
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
                        onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={teamMember.img}
                        onChange={(e) => setTeamMember({ ...teamMember, img: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={teamMember.order}
                        onChange={(e) => setTeamMember({ ...teamMember, order: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <EventSelector
                      value={teamMember.eventId}
                      onChange={(val) => setTeamMember({ ...teamMember, eventId: val })}
                    />
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
                  <h2 className="text-2xl font-bold mb-4">📸 Add Gallery Photo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={galleryImage.url}
                        onChange={(e) => setGalleryImage({ ...galleryImage, url: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="DJ Night Vibes"
                        value={galleryImage.alt}
                        onChange={(e) => setGalleryImage({ ...galleryImage, alt: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase">
                        Category
                      </label>
                      <select
                        value={galleryImage.category}
                        onChange={(e) =>
                          setGalleryImage({ ...galleryImage, category: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                      >
                        <option value="party">Party</option>
                        <option value="dance">Dance</option>
                        <option value="dj">DJ</option>
                        <option value="food">Food</option>
                        <option value="games">Games</option>
                      </select>
                    </div>
                    <EventSelector
                      value={galleryImage.eventId}
                      onChange={(val) => setGalleryImage({ ...galleryImage, eventId: val })}
                    />
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

        {/* RIGHT SIDEBAR - EVENT MONITOR */}
        <div className="w-80 bg-black/40 border-l border-white/10 p-6 h-screen sticky top-0 overflow-y-auto">
          <h3 className="text-lg font-bold mb-6 text-amber-500">📅 Event Monitor</h3>

          {/* CURRENT EVENT */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Current Event
            </h4>
            {currentEvent ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">{currentEvent.title}</h5>
                <p className="text-xs text-gray-400 mb-3">
                  📍 {currentEvent.location}
                  <br />
                  📅 {formatDate(currentEvent.eventDate)}
                </p>

                {linkedItemsCounts[currentEvent.id] && (
                  <div className="mb-3 p-2 bg-white/5 rounded-lg">
                    <p className="text-xs font-bold text-gray-400 mb-1">Linked Items:</p>
                    {Object.entries(linkedItemsCounts[currentEvent.id]).map(([col, count]) => (
                      <p key={col} className="text-xs text-gray-500">
                        • {count} {col}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(currentEvent)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(currentEvent.id)}
                    disabled={loading}
                    className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No current event</p>
            )}
          </div>

          {/* UPCOMING EVENTS */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
              ⏭️ Upcoming ({upcomingEvents.length})
            </h4>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <h5 className="font-bold text-sm text-white mb-1">{ev.title}</h5>
                    <p className="text-xs text-gray-500 mb-2">
                      📅 {formatDate(ev.eventDate)}
                      {linkedItemsCounts[ev.id] && (
                        <>
                          <br />
                          📎{' '}
                          {Object.values(linkedItemsCounts[ev.id]).reduce(
                            (sum, count) => sum + count,
                            0
                          )}{' '}
                          linked items
                        </>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(ev)}
                        className="flex-1 bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        disabled={loading}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No upcoming events</p>
            )}
          </div>

          {/* PREVIOUS EVENTS */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
              ⏮️ Previous ({previousEvents.length})
            </h4>
            {previousEvents.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {previousEvents.slice(0, 5).map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3"
                  >
                    <h5 className="font-bold text-xs text-gray-300">{ev.title}</h5>
                    <p className="text-xs text-gray-600">{formatDate(ev.eventDate)}</p>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      disabled={loading}
                      className="mt-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No previous events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;