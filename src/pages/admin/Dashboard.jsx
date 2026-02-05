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
  where
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

  // --- STATES FOR ALL MODULES ---
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
    featured: false
  });

  const [news, setNews] = useState({
    title: '',
    cat: 'Announcement'
  });

  const [event, setEvent] = useState({
    title: '',
    time: '',
    desc: '',
    icon: 'fa-star',
    order: 1
  });

  const [speaker, setSpeaker] = useState({
    name: '',
    role: '',
    img: '',
    order: 1
  });

  const [teamMember, setTeamMember] = useState({
    name: '',
    role: '',
    img: '',
    order: 1
  });

  const [galleryImage, setGalleryImage] = useState({
    url: '',
    alt: '',
    category: 'party'
  });

  // Real-time Fetching for Sidebar
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

    const unsubCurrent = onSnapshot(currentQuery, snapshot => {
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (events.length > 0) {
        setCurrentEvent(events[0]);
        setUpcomingEvents(events.slice(1));
      } else {
        setCurrentEvent(null);
        setUpcomingEvents([]);
      }
    });

    const unsubPrevious = onSnapshot(previousQuery, snapshot => {
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPreviousEvents(events);
    });

    return () => {
      unsubCurrent();
      unsubPrevious();
    };
  }, []);

  // --- SHARED HANDLERS ---
  const handleAddHeroEvent = async e => {
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
        updatedAt: serverTimestamp()
      };

      if (editMode && editingId) {
        await updateDoc(doc(db, 'heroEvents', editingId), data);
        alert('✅ Event Updated!');
        setEditMode(false);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'heroEvents'), {
          ...data,
          createdAt: serverTimestamp(),
          status: 'upcoming'
        });
        alert('🎉 Hero Event Created!');
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
      alert(err?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleGenericAdd = async (
    e,
    colName,
    state,
    setState,
    resetObj,
    msg
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave =
        colName === 'tickets'
          ? {
              ...state,
              features:
                typeof state.features === 'string'
                  ? state.features
                      .split(',')
                      .map(f => f.trim())
                      .filter(Boolean)
                  : state.features
            }
          : state;

      await addDoc(collection(db, colName), {
        ...dataToSave,
        createdAt: serverTimestamp()
      });
      alert(msg);
      setState(resetObj);
    } catch (err) {
      alert(err?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleEditEvent = eventDoc => {
    if (!eventDoc?.eventDate || !eventDoc.eventDate.toDate) {
      alert('This event is missing a valid eventDate.');
      return;
    }

    setEditMode(true);
    setEditingId(eventDoc.id);

    const date = eventDoc.eventDate.toDate();
    const dateTimeLocal = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
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
  };

  const handleDeleteEvent = async id => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'heroEvents', id));
      } catch (err) {
        alert(err?.message || 'Failed to delete event');
      }
    }
  };

  const formatDate = ts => {
    if (!ts) return 'N/A';

    // Firestore Timestamp
    if (ts.toDate) {
      return ts
        .toDate()
        .toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
    }

    // JS Date
    if (ts instanceof Date) {
      return ts.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="flex flex-col lg:flex-row">
        {/* MAIN DASHBOARD AREA */}
        <div className="flex-1 p-6 lg:p-12">
          <header className="mb-10 flex justify-between items-center border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl font-black text-amber-500 tracking-tighter">
                ADMIN PANEL
              </h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
                GEC Kishanganj • Event Management
              </p>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl text-xs font-black transition-all"
            >
              LOGOUT
            </button>
          </header>

          {/* TAB SYSTEM */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {[
              { id: 'heroEvents', label: '🎯 Hero', icon: '🎯' },
              { id: 'tickets', label: 'Tickets', icon: '🎫' },
              { id: 'news', label: 'News', icon: '📰' },
              { id: 'events', label: 'Timeline', icon: '⏰' },
              { id: 'speakers', label: 'Speakers', icon: '🎤' },
              { id: 'team', label: 'Team', icon: '👥' },
              { id: 'gallery', label: 'Gallery', icon: '📸' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditMode(false);
                }}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* FORM CONTAINER */}
          <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
            {/* 1. HERO FORM */}
            {activeTab === 'heroEvents' && (
              <form onSubmit={handleAddHeroEvent} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editMode ? 'Edit Hero Event' : 'Create New Hero Event'}
                  </h2>
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setHeroEvent({
                          title: '',
                          date: '',
                          location: '',
                          eventDateTime: '',
                          backgroundImage: '',
                          backgroundVideo: ''
                        });
                      }}
                      className="text-gray-500 underline text-sm"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 ml-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="Fresher Party 2026"
                      value={heroEvent.title}
                      onChange={e =>
                        setHeroEvent({ ...heroEvent, title: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 ml-2">
                      Display Date
                    </label>
                    <input
                      type="text"
                      placeholder="Monday, 15 March"
                      value={heroEvent.date}
                      onChange={e =>
                        setHeroEvent({ ...heroEvent, date: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 ml-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Main Auditorium"
                      value={heroEvent.location}
                      onChange={e =>
                        setHeroEvent({
                          ...heroEvent,
                          location: e.target.value
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 ml-2">
                      Actual Timestamp
                    </label>
                    <input
                      type="datetime-local"
                      value={heroEvent.eventDateTime}
                      onChange={e =>
                        setHeroEvent({
                          ...heroEvent,
                          eventDateTime: e.target.value
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 ml-2">
                      Video Background URL
                    </label>
                    <input
                      type="url"
                      placeholder="Direct MP4 link"
                      value={heroEvent.backgroundVideo}
                      onChange={e =>
                        setHeroEvent({
                          ...heroEvent,
                          backgroundVideo: e.target.value
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all disabled:opacity-50"
                >
                  {loading
                    ? 'PROCESSING...'
                    : editMode
                    ? 'UPDATE EVENT'
                    : 'LAUNCH EVENT'}
                </button>
              </form>
            )}

            {/* 2. TICKETS FORM */}
            {activeTab === 'tickets' && (
              <form
                onSubmit={e =>
                  handleGenericAdd(
                    e,
                    'tickets',
                    ticket,
                    setTicket,
                    { name: '', price: '', features: '', featured: false },
                    'Ticket Added!'
                  )
                }
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Add Ticket Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Tier Name (e.g. Gold Pass)"
                    value={ticket.name}
                    onChange={e =>
                      setTicket({ ...ticket, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g. ₹499)"
                    value={ticket.price}
                    onChange={e =>
                      setTicket({ ...ticket, price: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <textarea
                    placeholder="Features (Separate with commas: e.g. Free Drinks, Front Row, Dinner)"
                    value={ticket.features}
                    onChange={e =>
                      setTicket({ ...ticket, features: e.target.value })
                    }
                    className="input-field md:col-span-2 h-32"
                    required
                  />
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={ticket.featured}
                      onChange={e =>
                        setTicket({
                          ...ticket,
                          featured: e.target.checked
                        })
                      }
                      className="accent-amber-500"
                    />
                    <span className="text-sm font-bold">
                      Highlight as Recommended
                    </span>
                  </label>
                </div>
                <button className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl">
                  ADD TICKET
                </button>
              </form>
            )}

            {/* 3. NEWS FORM */}
            {activeTab === 'news' && (
              <form
                onSubmit={e =>
                  handleGenericAdd(
                    e,
                    'news',
                    news,
                    setNews,
                    { title: '', cat: 'Announcement' },
                    'News Posted!'
                  )
                }
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Broadcast Update</h2>
                <input
                  type="text"
                  placeholder="Enter headline..."
                  value={news.title}
                  onChange={e =>
                    setNews({ ...news, title: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <select
                  value={news.cat}
                  onChange={e =>
                    setNews({ ...news, cat: e.target.value })
                  }
                  className="input-field"
                >
                  <option>Announcement</option>
                  <option>Important</option>
                  <option>Urgent</option>
                  <option>Sponsor</option>
                </select>
                <button className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl">
                  PUBLISH NEWS
                </button>
              </form>
            )}

            {/* 4. TIMELINE FORM */}
            {activeTab === 'events' && (
              <form
                onSubmit={e =>
                  handleGenericAdd(
                    e,
                    'events',
                    event,
                    setEvent,
                    { title: '', time: '', desc: '', icon: 'fa-star', order: 1 },
                    'Activity Added!'
                  )
                }
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Add Schedule Activity</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={event.title}
                    onChange={e =>
                      setEvent({ ...event, title: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Time (9:00 PM)"
                    value={event.time}
                    onChange={e =>
                      setEvent({ ...event, time: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sort Order"
                    value={event.order}
                    onChange={e =>
                      setEvent({ ...event, order: Number(e.target.value) })
                    }
                    className="input-field"
                  />
                  <select
                    value={event.icon}
                    onChange={e =>
                      setEvent({ ...event, icon: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="fa-star">Star Icon</option>
                    <option value="fa-music">Music Icon</option>
                    <option value="fa-utensils">Food Icon</option>
                    <option value="fa-microphone">Microphone Icon</option>
                  </select>
                </div>
                <textarea
                  placeholder="Short activity description..."
                  value={event.desc}
                  onChange={e =>
                    setEvent({ ...event, desc: e.target.value })
                  }
                  className="input-field h-24"
                />
                <button className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl">
                  ADD TO TIMELINE
                </button>
              </form>
            )}

            {/* 5. SPEAKERS / TEAM / GALLERY */}
            {['speakers', 'team', 'gallery'].includes(activeTab) && (
              <form
                onSubmit={e => {
                  if (activeTab === 'speakers') {
                    handleGenericAdd(
                      e,
                      'speakers',
                      speaker,
                      setSpeaker,
                      { name: '', role: '', img: '', order: 1 },
                      'Speaker Added!'
                    );
                  } else if (activeTab === 'team') {
                    handleGenericAdd(
                      e,
                      'team',
                      teamMember,
                      setTeamMember,
                      { name: '', role: '', img: '', order: 1 },
                      'Team Member Added!'
                    );
                  } else if (activeTab === 'gallery') {
                    handleGenericAdd(
                      e,
                      'gallery',
                      galleryImage,
                      setGalleryImage,
                      { url: '', alt: '', category: 'party' },
                      'Photo Added!'
                    );
                  }
                }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">
                  Add{' '}
                  {activeTab.replace(/^\w/, c => c.toUpperCase())} Item
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTab !== 'gallery' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={
                          activeTab === 'speakers'
                            ? speaker.name
                            : teamMember.name
                        }
                        onChange={e =>
                          activeTab === 'speakers'
                            ? setSpeaker({
                                ...speaker,
                                name: e.target.value
                              })
                            : setTeamMember({
                                ...teamMember,
                                name: e.target.value
                              })
                        }
                        className="input-field"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g. Chief Guest / Coordinator)"
                        value={
                          activeTab === 'speakers'
                            ? speaker.role
                            : teamMember.role
                        }
                        onChange={e =>
                          activeTab === 'speakers'
                            ? setSpeaker({
                                ...speaker,
                                role: e.target.value
                              })
                            : setTeamMember({
                                ...teamMember,
                                role: e.target.value
                              })
                        }
                        className="input-field"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={
                          activeTab === 'speakers'
                            ? speaker.img
                            : teamMember.img
                        }
                        onChange={e =>
                          activeTab === 'speakers'
                            ? setSpeaker({
                                ...speaker,
                                img: e.target.value
                              })
                            : setTeamMember({
                                ...teamMember,
                                img: e.target.value
                              })
                        }
                        className="input-field md:col-span-2"
                        required
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={galleryImage.url}
                        onChange={e =>
                          setGalleryImage({
                            ...galleryImage,
                            url: e.target.value
                          })
                        }
                        className="input-field md:col-span-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Alt Description"
                        value={galleryImage.alt}
                        onChange={e =>
                          setGalleryImage({
                            ...galleryImage,
                            alt: e.target.value
                          })
                        }
                        className="input-field"
                        required
                      />
                      <select
                        value={galleryImage.category}
                        onChange={e =>
                          setGalleryImage({
                            ...galleryImage,
                            category: e.target.value
                          })
                        }
                        className="input-field"
                      >
                        <option value="party">Party Shots</option>
                        <option value="crowd">Crowd</option>
                        <option value="stage">Stage Performance</option>
                      </select>
                    </>
                  )}
                </div>
                <button className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl">
                  SUBMIT ENTRY
                </button>
              </form>
            )}
          </div>
        </div>

        {/* SIDEBAR MONITOR */}
        <div className="w-full lg:w-96 bg-black/50 border-l border-white/5 p-8 h-screen sticky top-0 overflow-y-auto no-scrollbar">
          <h3 className="text-xl font-black mb-8 text-amber-500 tracking-tighter">
            LIVE MONITOR
          </h3>

          <div className="space-y-10">
            {/* CURRENT SECTION */}
            <section>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{' '}
                Active Event
              </h4>
              {currentEvent ? (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
                  <h5 className="font-bold text-lg mb-1 leading-tight">
                    {currentEvent.title}
                  </h5>
                  <p className="text-xs text-gray-400 mb-4">
                    {formatDate(currentEvent.eventDate)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEvent(currentEvent)}
                      className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-xl text-[10px] font-black hover:bg-blue-500 hover:text-white transition-all"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(currentEvent.id)}
                      className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 italic px-4">
                  No active event found.
                </p>
              )}
            </section>

            {/* UPCOMING LIST */}
            <section>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                Queued ({upcomingEvents.length})
              </h4>
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="bg-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-gray-300">
                        {ev.title}
                      </h5>
                      <p className="text-[9px] text-gray-500">
                        {formatDate(ev.eventDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditEvent(ev)}
                      className="opacity-0 group-hover:opacity-100 text-amber-500 text-[10px] font-black transition-all"
                    >
                      EDIT
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* PREVIOUS LIST (OPTIONAL DISPLAY) */}
            {previousEvents.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  Previous ({previousEvents.length})
                </h4>
                <div className="space-y-3">
                  {previousEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="bg-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-gray-300">
                          {ev.title}
                        </h5>
                        <p className="text-[9px] text-gray-500">
                          {formatDate(ev.eventDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: white;
          font-size: 0.875rem;
          transition: all 0.2s;
          outline: none;
        }
        .input-field:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: #f59e0b;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
