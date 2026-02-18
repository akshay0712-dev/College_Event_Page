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
import { sendWelcomeEmail, sendRejectionEmail } from '../../utils/emailService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('heroEvents');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Event Lists for Sidebar
  const [currentEvent, setCurrentEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [linkedItemsCounts, setLinkedItemsCounts] = useState({});

  // Data Lists
  const [tickets, setTickets] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  // Registrations
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0, revenue: 0 });

  // Form States
  const [heroEvent, setHeroEvent] = useState({
    title: '', date: '', location: '', eventDateTime: '',
    backgroundImage: '', backgroundVideo: ''
  });

  const [ticket, setTicket] = useState({
    name: '', price: '', features: '', featured: false, eventId: ''
  });

  const [news, setNews] = useState({
    title: '', cat: 'Announcement', eventId: ''
  });

  const [event, setEvent] = useState({
    title: '', time: '', desc: '', icon: 'fa-star', order: 1, eventId: ''
  });

  const [speaker, setSpeaker] = useState({
    name: '', role: '', img: '', order: 1, eventId: ''
  });

  const [teamMember, setTeamMember] = useState({
    name: '', role: '', img: '', order: 1, eventId: ''
  });

  const [galleryImage, setGalleryImage] = useState({
    url: '', alt: '', category: 'party', eventId: ''
  });

  const [videoHighlight, setVideoHighlight] = useState({
    url: '', title: '', description: '', thumbnail: '',
    orientation: 'landscape', order: 1, eventId: ''
  });

  const [sponsor, setSponsor] = useState({
    name: '', logo: '', website: '', tier: 'silver', order: 1, eventId: ''
  });

  // ── Real-time: Event Monitor ──
  useEffect(() => {
    const eventsCollection = collection(db, 'heroEvents');
    const now = new Date();

    const currentQuery = query(eventsCollection, where('eventDate', '>=', now), orderBy('eventDate', 'asc'));
    const previousQuery = query(eventsCollection, where('eventDate', '<', now), orderBy('eventDate', 'desc'));

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

    return () => { unsubCurrent(); unsubPrevious(); };
  }, []);

  // ── Real-time: All Collections ──
  useEffect(() => {
    const unsubscribers = [];

    unsubscribers.push(
      onSnapshot(query(collection(db, 'tickets'), orderBy('createdAt', 'desc')), (s) =>
        setTickets(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc')), (s) =>
        setNewsList(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'events'), orderBy('order', 'asc')), (s) =>
        setTimelineEvents(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'videos'), orderBy('order', 'asc')), (s) =>
        setVideos(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'speakers'), orderBy('order', 'asc')), (s) =>
        setSpeakers(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'team'), orderBy('order', 'asc')), (s) =>
        setTeamMembers(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')), (s) =>
        setGalleryImages(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'sponsors'), orderBy('tier', 'asc')), (s) =>
        setSponsors(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
    );
    unsubscribers.push(
      onSnapshot(query(collection(db, 'registrations'), orderBy('createdAt', 'desc')), (s) => {
        const regs = s.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRegistrations(regs);
        setStats({
          total:    regs.length,
          pending:  regs.filter((r) => r.status === 'pending').length,
          verified: regs.filter((r) => r.status === 'verified').length,
          rejected: regs.filter((r) => r.status === 'rejected').length,
          revenue:  regs.filter((r) => r.status === 'verified').length * 500,
        });
      })
    );

    return () => unsubscribers.forEach((u) => u());
  }, []);

  // ── Linked Item Counts ──
  useEffect(() => {
    const cols = ['tickets','news','events','speakers','team','gallery','videos','sponsors','registrations'];
    const unsubscribes = cols.map((colName) =>
      onSnapshot(collection(db, colName), (snapshot) => {
        const counts = {};
        snapshot.docs.forEach((d) => {
          const eventId = d.data().eventId;
          if (eventId) {
            if (!counts[eventId]) counts[eventId] = {};
            if (!counts[eventId][colName]) counts[eventId][colName] = 0;
            counts[eventId][colName]++;
          }
        });
        setLinkedItemsCounts((prev) => {
          const next = { ...prev };
          Object.keys(counts).forEach((eid) => {
            next[eid] = { ...(next[eid] || {}), ...counts[eid] };
          });
          return next;
        });
      })
    );
    return () => unsubscribes.forEach((u) => u());
  }, []);

  // ── Registration: Verify / Reject ──
  const handleVerifyRegistration = async (regId, status, message = '') => {
    setLoading(true);
    setSendingEmail(true);
    try {
      const registration = registrations.find((r) => r.id === regId);
      const msg = message || (status === 'verified'
        ? 'Payment verified! Welcome to Fresher 2026.'
        : 'Verification failed. Please contact admin.');

      await updateDoc(doc(db, 'registrations', regId), {
        status,
        verificationMessage: msg,
        verifiedAt: serverTimestamp(),
        verifiedBy: auth.currentUser?.email || 'admin',
      });

      try {
        let result;
        if (status === 'verified') {
          result = await sendWelcomeEmail({ ...registration, verificationMessage: msg });
          alert(result.success
            ? `✅ Registration Verified!\n📧 Welcome email sent to ${registration.email}`
            : `✅ Registration Verified!\n⚠️ Email failed: ${result.error}`
          );
        } else if (status === 'rejected') {
          result = await sendRejectionEmail(registration, msg);
          alert(result.success
            ? `❌ Registration Rejected.\n📧 Notification sent to ${registration.email}`
            : `❌ Registration Rejected.\n⚠️ Email failed: ${result.error}`
          );
        }
      } catch (emailErr) {
        console.error('Email error:', emailErr);
        alert(`Registration ${status === 'verified' ? 'Verified ✅' : 'Rejected ❌'} but email failed.`);
      }

      setSelectedRegistration(null);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
      setSendingEmail(false);
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!window.confirm('Delete this registration permanently?')) return;
    try {
      await deleteDoc(doc(db, 'registrations', regId));
      alert('🗑️ Registration Deleted!');
      if (selectedRegistration?.id === regId) setSelectedRegistration(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleBulkVerify = async () => {
    const pendingRegs = registrations.filter((r) => r.status === 'pending');
    if (!pendingRegs.length) { alert('No pending registrations!'); return; }
    if (!window.confirm(`Verify all ${pendingRegs.length} pending registrations?\nThis will send welcome emails to all of them.`)) return;

    setLoading(true);
    setSendingEmail(true);
    let successCount = 0;
    let emailCount = 0;

    for (const reg of pendingRegs) {
      try {
        await updateDoc(doc(db, 'registrations', reg.id), {
          status: 'verified',
          verificationMessage: 'Payment verified! Welcome to Fresher 2026.',
          verifiedAt: serverTimestamp(),
          verifiedBy: auth.currentUser?.email || 'admin',
        });
        successCount++;
        try {
          const r = await sendWelcomeEmail(reg);
          if (r.success) emailCount++;
        } catch {}
      } catch {}
    }

    alert(`✅ Bulk Complete!\n✓ ${successCount} verified\n📧 ${emailCount} emails sent`);
    setLoading(false);
    setSendingEmail(false);
  };

  const handleExportCSV = () => {
    const data = filterStatus === 'all' ? registrations : registrations.filter((r) => r.status === filterStatus);
    const csv = [
      ['Name','Email','Phone','Roll No','Reg No','Branch','Gender','UTR','Status','Date'].join(','),
      ...data.map((r) => [
        r.fullName, r.email, r.phone, r.collegeRollNo, r.registrationNo,
        r.branch, r.gender, r.utrNumber, r.status,
        r.createdAt?.toDate?.()?.toLocaleDateString() || ''
      ].join(','))
    ].join('\n');

    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `registrations_${filterStatus}_${new Date().toISOString().slice(0, 10)}.csv`
    });
    a.click();
  };

  // ── Hero Events ──
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
        updatedAt: serverTimestamp(),
      };

      if (editMode && editingId) {
        await updateDoc(doc(db, 'heroEvents', editingId), data);
        alert('✅ Event Updated!');
        setEditMode(false); setEditingId(null);
      } else {
        await addDoc(collection(db, 'heroEvents'), { ...data, createdAt: serverTimestamp() });
        alert('🎉 Event Created!');
      }
      setHeroEvent({ title: '', date: '', location: '', eventDateTime: '', backgroundImage: '', backgroundVideo: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditHeroEvent = (ev) => {
    if (!ev?.eventDate?.toDate) { alert('⚠️ Invalid event data'); return; }
    setEditMode(true); setEditingId(ev.id);
    const date = ev.eventDate.toDate();
    const dateTimeLocal = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setHeroEvent({
      title: ev.title || '', date: ev.date || '', location: ev.location || '',
      eventDateTime: dateTimeLocal,
      backgroundImage: ev.backgroundImage || '', backgroundVideo: ev.backgroundVideo || ''
    });
    setActiveTab('heroEvents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHeroEvent = async (id) => {
    const cols = ['tickets','news','events','speakers','team','gallery','videos','sponsors','registrations'];
    const counts = linkedItemsCounts[id] || {};
    const totalItems = Object.values(counts).reduce((s, c) => s + c, 0);
    const confirmMessage = totalItems > 0
      ? `⚠️ DELETE EVENT?\n\nThis will also delete:\n${Object.entries(counts).map(([col, c]) => `• ${c} ${col}`).join('\n')}\n\nTotal: ${totalItems} items\n\nCannot be undone!`
      : '⚠️ Delete this event?\n\nCannot be undone!';

    if (!window.confirm(confirmMessage)) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'heroEvents', id));
      const deletePromises = cols.map(async (colName) => {
        const q = query(collection(db, colName), where('eventId', '==', id));
        const snapshot = await getDocs(q);
        return Promise.all(snapshot.docs.map((d) => deleteDoc(doc(db, colName, d.id))));
      });
      await Promise.all(deletePromises);
      alert(`🗑️ Deleted! ${totalItems > 0 ? `${totalItems} linked items removed.` : ''}`);
    } catch (err) { alert('Error: ' + err.message); }
    finally { setLoading(false); }
  };

  // ── Tickets ──
  const handleAddTicket = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const featuresArray = ticket.features.split(',').map((f) => f.trim()).filter(Boolean);
      const data = { name: ticket.name, price: ticket.price, features: featuresArray, featured: ticket.featured, eventId: ticket.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'tickets', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Ticket Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'tickets'), data); alert('🎫 Ticket Added!'); }
      setTicket({ name: '', price: '', features: '', featured: false, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditTicket = (item) => {
    setEditMode(true); setEditingId(item.id);
    setTicket({ name: item.name || '', price: item.price || '', features: Array.isArray(item.features) ? item.features.join(', ') : '', featured: item.featured || false, eventId: item.eventId || '' });
    setActiveTab('tickets'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    try { await deleteDoc(doc(db, 'tickets', id)); alert('🗑️ Ticket Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── News ──
  const handleAddNews = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { title: news.title, cat: news.cat, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), eventId: news.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'news', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ News Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'news'), data); alert('📰 News Posted!'); }
      setNews({ title: '', cat: 'Announcement', eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditNews = (item) => {
    setEditMode(true); setEditingId(item.id);
    setNews({ title: item.title || '', cat: item.cat || 'Announcement', eventId: item.eventId || '' });
    setActiveTab('news'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try { await deleteDoc(doc(db, 'news', id)); alert('🗑️ News Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Timeline Events ──
  const handleAddEvent = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { title: event.title, time: event.time, desc: event.desc, icon: event.icon, order: Number(event.order), eventId: event.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'events', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Timeline Event Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'events'), data); alert('⏰ Timeline Event Added!'); }
      setEvent({ title: '', time: '', desc: '', icon: 'fa-star', order: 1, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditTimelineEvent = (item) => {
    setEditMode(true); setEditingId(item.id);
    setEvent({ title: item.title || '', time: item.time || '', desc: item.desc || '', icon: item.icon || 'fa-star', order: item.order || 1, eventId: item.eventId || '' });
    setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTimelineEvent = async (id) => {
    if (!window.confirm('Delete this timeline event?')) return;
    try { await deleteDoc(doc(db, 'events', id)); alert('🗑️ Timeline Event Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Videos ──
  const handleAddVideo = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { url: videoHighlight.url, title: videoHighlight.title, description: videoHighlight.description || '', thumbnail: videoHighlight.thumbnail || '', orientation: videoHighlight.orientation, order: Number(videoHighlight.order), eventId: videoHighlight.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'videos', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Video Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'videos'), data); alert('🎬 Video Added!'); }
      setVideoHighlight({ url: '', title: '', description: '', thumbnail: '', orientation: 'landscape', order: 1, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditVideo = (item) => {
    setEditMode(true); setEditingId(item.id);
    setVideoHighlight({ url: item.url || '', title: item.title || '', description: item.description || '', thumbnail: item.thumbnail || '', orientation: item.orientation || 'landscape', order: item.order || 1, eventId: item.eventId || '' });
    setActiveTab('videos'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try { await deleteDoc(doc(db, 'videos', id)); alert('🗑️ Video Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Speakers ──
  const handleAddSpeaker = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { name: speaker.name, role: speaker.role, img: speaker.img, order: Number(speaker.order), eventId: speaker.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'speakers', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Speaker Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'speakers'), data); alert('🎤 Speaker Added!'); }
      setSpeaker({ name: '', role: '', img: '', order: 1, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditSpeaker = (item) => {
    setEditMode(true); setEditingId(item.id);
    setSpeaker({ name: item.name || '', role: item.role || '', img: item.img || '', order: item.order || 1, eventId: item.eventId || '' });
    setActiveTab('speakers'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSpeaker = async (id) => {
    if (!window.confirm('Delete this speaker?')) return;
    try { await deleteDoc(doc(db, 'speakers', id)); alert('🗑️ Speaker Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Team ──
  const handleAddTeamMember = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { name: teamMember.name, role: teamMember.role, img: teamMember.img, order: Number(teamMember.order), eventId: teamMember.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'team', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Team Member Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'team'), data); alert('👥 Team Member Added!'); }
      setTeamMember({ name: '', role: '', img: '', order: 1, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditTeamMember = (item) => {
    setEditMode(true); setEditingId(item.id);
    setTeamMember({ name: item.name || '', role: item.role || '', img: item.img || '', order: item.order || 1, eventId: item.eventId || '' });
    setActiveTab('team'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try { await deleteDoc(doc(db, 'team', id)); alert('🗑️ Team Member Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Gallery ──
  const handleAddGalleryImage = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { url: galleryImage.url, alt: galleryImage.alt, category: galleryImage.category, eventId: galleryImage.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'gallery', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Photo Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'gallery'), data); alert('📸 Photo Added!'); }
      setGalleryImage({ url: '', alt: '', category: 'party', eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditGalleryImage = (item) => {
    setEditMode(true); setEditingId(item.id);
    setGalleryImage({ url: item.url || '', alt: item.alt || '', category: item.category || 'party', eventId: item.eventId || '' });
    setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try { await deleteDoc(doc(db, 'gallery', id)); alert('🗑️ Photo Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Sponsors ──
  const handleAddSponsor = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { name: sponsor.name, logo: sponsor.logo, website: sponsor.website || '', tier: sponsor.tier, order: Number(sponsor.order), eventId: sponsor.eventId || null, createdAt: serverTimestamp() };
      if (editMode && editingId) {
        await updateDoc(doc(db, 'sponsors', editingId), { ...data, updatedAt: serverTimestamp() });
        alert('✅ Sponsor Updated!'); setEditMode(false); setEditingId(null);
      } else { await addDoc(collection(db, 'sponsors'), data); alert('🤝 Sponsor Added!'); }
      setSponsor({ name: '', logo: '', website: '', tier: 'silver', order: 1, eventId: '' });
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const handleEditSponsor = (item) => {
    setEditMode(true); setEditingId(item.id);
    setSponsor({ name: item.name || '', logo: item.logo || '', website: item.website || '', tier: item.tier || 'silver', order: item.order || 1, eventId: item.eventId || '' });
    setActiveTab('sponsors'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Delete this sponsor?')) return;
    try { await deleteDoc(doc(db, 'sponsors', id)); alert('🗑️ Sponsor Deleted!'); }
    catch (err) { alert('Error: ' + err.message); }
  };

  // ── Cancel Edit ──
  const handleCancelEdit = () => {
    setEditMode(false); setEditingId(null); setSelectedRegistration(null);
    setHeroEvent({ title: '', date: '', location: '', eventDateTime: '', backgroundImage: '', backgroundVideo: '' });
    setTicket({ name: '', price: '', features: '', featured: false, eventId: '' });
    setNews({ title: '', cat: 'Announcement', eventId: '' });
    setEvent({ title: '', time: '', desc: '', icon: 'fa-star', order: 1, eventId: '' });
    setVideoHighlight({ url: '', title: '', description: '', thumbnail: '', orientation: 'landscape', order: 1, eventId: '' });
    setSpeaker({ name: '', role: '', img: '', order: 1, eventId: '' });
    setTeamMember({ name: '', role: '', img: '', order: 1, eventId: '' });
    setGalleryImage({ url: '', alt: '', category: 'party', eventId: '' });
    setSponsor({ name: '', logo: '', website: '', tier: 'silver', order: 1, eventId: '' });
  };

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    if (!d) return 'N/A';
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ── Reusable Event Selector ──
  const EventSelector = ({ value, onChange, label = 'Link to Event (Optional)' }) => (
    <div className="md:col-span-2">
      <label className="block text-xs text-gray-400 mb-2 uppercase">🔗 {label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500">
        <option value="">No Event Link (General Item)</option>
        {currentEvent && <option value={currentEvent.id}>🔴 {currentEvent.title} (Current)</option>}
        {upcomingEvents.map((ev) => <option key={ev.id} value={ev.id}>⏭️ {ev.title}</option>)}
        {previousEvents.map((ev) => <option key={ev.id} value={ev.id}>⏮️ {ev.title}</option>)}
      </select>
      <p className="text-xs text-gray-500 mt-1">If linked, this item will be auto-deleted when the event is deleted</p>
    </div>
  );

  const filteredRegistrations = filterStatus === 'all' ? registrations : registrations.filter((r) => r.status === filterStatus);

  // ── INPUT CLASS SHORTHAND ──
  const inputCls = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Email Sending Overlay */}
      {sendingEmail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center max-w-sm w-full mx-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-5" />
            <h3 className="text-xl font-bold mb-2">Sending Email...</h3>
            <p className="text-gray-400 text-sm">Notifying the student, please wait</p>
          </div>
        </div>
      )}

      <div className="flex">
        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-4xl font-bold text-amber-500">🎉 Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">GEC Kishanganj • Full CRUD • Email Notifications</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleExportCSV}
                  className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                  📥 Export CSV
                </button>
                <button onClick={() => auth.signOut()}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">
                  LOGOUT
                </button>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                { label: 'Total', value: stats.total, icon: '👥', border: 'border-blue-500/30', bg: 'from-blue-500/20 to-blue-600/20', text: 'text-blue-400' },
                { label: 'Pending', value: stats.pending, icon: '⏳', border: 'border-amber-500/30', bg: 'from-amber-500/20 to-amber-600/20', text: 'text-amber-400' },
                { label: 'Verified', value: stats.verified, icon: '✅', border: 'border-green-500/30', bg: 'from-green-500/20 to-green-600/20', text: 'text-green-400' },
                { label: 'Rejected', value: stats.rejected, icon: '❌', border: 'border-red-500/30', bg: 'from-red-500/20 to-red-600/20', text: 'text-red-400' },
                { label: 'Revenue', value: `₹${stats.revenue}`, icon: '💰', border: 'border-purple-500/30', bg: 'from-purple-500/20 to-purple-600/20', text: 'text-purple-400' },
              ].map(({ label, value, icon, border, bg, text }) => (
                <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-4`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className={`text-2xl font-bold ${text}`}>{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Migration Alert */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h3 className="text-sm font-bold text-blue-400 mb-2">🔄 First Time Setup</h3>
              <p className="text-xs text-gray-400 mb-3">Click below to add event linking to all existing data. Only needs to be done once.</p>
              <button type="button" onClick={async () => {
                try {
                  const { migrateAllCollections } = await import('../../utils/migrateGallery.js');
                  await migrateAllCollections();
                } catch { alert('Migration utility not found. This is optional.'); }
              }} className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold text-sm">
                🔄 Migrate All Collections
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'heroEvents', label: '🎯 Hero Events' },
                { id: 'registrations', label: '📝 Registrations' },
                { id: 'tickets', label: '🎫 Tickets' },
                { id: 'news', label: '📰 News' },
                { id: 'events', label: '⏰ Timeline' },
                { id: 'videos', label: '🎬 Videos' },
                { id: 'speakers', label: '🎤 Speakers' },
                { id: 'team', label: '👥 Team' },
                { id: 'gallery', label: '📸 Gallery' },
                { id: 'sponsors', label: '🤝 Sponsors' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); handleCancelEdit(); }}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {tab.label}
                  {tab.id === 'registrations' && stats.pending > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{stats.pending}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-6">

              {/* ── REGISTRATIONS TAB ── */}
              {activeTab === 'registrations' && (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'pending', 'verified', 'rejected'].map((s) => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${filterStatus === s ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                          {s} ({s === 'all' ? stats.total : s === 'pending' ? stats.pending : s === 'verified' ? stats.verified : stats.rejected})
                        </button>
                      ))}
                    </div>
                    {stats.pending > 0 && (
                      <button onClick={handleBulkVerify} disabled={loading}
                        className="ml-auto bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black px-5 py-2 rounded-xl text-sm font-bold transition-all">
                        ✅ Verify All Pending ({stats.pending})
                      </button>
                    )}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">
                      Registrations ({filteredRegistrations.length})
                      <span className="ml-3 text-sm text-amber-500 font-normal">{stats.pending} pending approval</span>
                    </h3>

                    <div className="space-y-4">
                      {filteredRegistrations.map((reg) => (
                        <div key={reg.id}
                          className={`bg-black/40 border rounded-xl p-6 ${reg.status === 'pending' ? 'border-amber-500/50' : reg.status === 'verified' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                          <div className="flex gap-6">
                            <img
                              src={reg.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reg.fullName || 'U')}&background=random`}
                              alt={reg.fullName}
                              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reg.fullName || 'U')}&background=random`; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-bold text-lg">{reg.fullName}</h4>
                                  <p className="text-sm text-gray-400">{reg.branch} • {reg.gender || 'N/A'} • {reg.collegeRollNo}</p>
                                  <p className="text-xs text-gray-500 mt-1">{formatDate(reg.createdAt)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${reg.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : reg.status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {reg.status?.toUpperCase()}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div><span className="text-gray-500">Email:</span> <span className="text-gray-200">{reg.email}</span></div>
                                <div><span className="text-gray-500">Phone:</span> <span className="text-gray-200">{reg.phone}</span></div>
                                <div><span className="text-gray-500">Reg No:</span> <span className="text-gray-200">{reg.registrationNo}</span></div>
                                <div><span className="text-gray-500">UTR:</span> <span className="text-gray-200 font-mono font-bold">{reg.utrNumber || 'N/A'}</span></div>
                              </div>

                              {reg.verificationMessage && (
                                <div className="mb-4 p-3 bg-white/5 rounded-lg text-sm border border-white/5">
                                  <strong className="text-gray-400">Admin Note:</strong>{' '}
                                  <span className="text-gray-200">{reg.verificationMessage}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {reg.paymentUrl && (
                                  <button onClick={() => setSelectedRegistration(reg)}
                                    className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                                    👁 View Payment
                                  </button>
                                )}
                                {reg.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        const m = prompt('Verification message (optional):');
                                        handleVerifyRegistration(reg.id, 'verified', m || 'Payment verified! Welcome to Fresher 2026.');
                                      }}
                                      disabled={loading}
                                      className="bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                                      ✓ Verify &amp; Email
                                    </button>
                                    <button
                                      onClick={() => {
                                        const m = prompt('Reason for rejection:');
                                        if (m) handleVerifyRegistration(reg.id, 'rejected', m);
                                      }}
                                      disabled={loading}
                                      className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                                      ✗ Reject &amp; Email
                                    </button>
                                  </>
                                )}
                                <button onClick={() => handleDeleteRegistration(reg.id)}
                                  className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all ml-auto">
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredRegistrations.length === 0 && (
                        <p className="text-center text-gray-500 py-12">No {filterStatus === 'all' ? '' : filterStatus} registrations yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Payment Screenshot Modal */}
              {selectedRegistration && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedRegistration(null)}>
                  <div className="bg-[#111] border border-white/20 rounded-2xl p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Payment — {selectedRegistration.fullName}</h3>
                      <button onClick={() => setSelectedRegistration(null)} className="text-gray-400 hover:text-white text-3xl leading-none">×</button>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      UTR: <span className="text-white font-mono font-bold">{selectedRegistration.utrNumber}</span>
                    </p>
                    <img src={selectedRegistration.paymentUrl} alt="Payment Screenshot"
                      className="w-full rounded-xl max-h-96 object-contain bg-black/50" />
                    {selectedRegistration.status === 'pending' && (
                      <div className="flex gap-3 mt-6">
                        <button onClick={() => {
                          const m = prompt('Verification message (optional):');
                          handleVerifyRegistration(selectedRegistration.id, 'verified', m || 'Payment verified!');
                        }} className="flex-1 bg-green-500 hover:bg-green-400 text-black px-4 py-3 rounded-xl font-bold transition-all">
                          ✓ Verify &amp; Email
                        </button>
                        <button onClick={() => {
                          const m = prompt('Reason for rejection:');
                          if (m) handleVerifyRegistration(selectedRegistration.id, 'rejected', m);
                        }} className="flex-1 bg-red-500 hover:bg-red-400 text-white px-4 py-3 rounded-xl font-bold transition-all">
                          ✗ Reject &amp; Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── HERO EVENTS TAB ── */}
              {activeTab === 'heroEvents' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddHeroEvent} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Hero Event' : '🎯 Create New Event'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel Edit</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Event Title</label>
                          <input type="text" placeholder="GEC Fresher Party 2026" value={heroEvent.title}
                            onChange={(e) => setHeroEvent({ ...heroEvent, title: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Display Date</label>
                          <input type="text" placeholder="March 15, 2026" value={heroEvent.date}
                            onChange={(e) => setHeroEvent({ ...heroEvent, date: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Location</label>
                          <input type="text" placeholder="College Auditorium" value={heroEvent.location}
                            onChange={(e) => setHeroEvent({ ...heroEvent, location: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Event Date/Time</label>
                          <input type="datetime-local" value={heroEvent.eventDateTime}
                            onChange={(e) => setHeroEvent({ ...heroEvent, eventDateTime: e.target.value })} className={inputCls} required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">🎬 Video URL</label>
                          <input type="url" placeholder="https://example.com/video.mp4" value={heroEvent.backgroundVideo}
                            onChange={(e) => setHeroEvent({ ...heroEvent, backgroundVideo: e.target.value })} className={inputCls} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">🖼️ Image URL (Fallback)</label>
                          <input type="url" placeholder="https://images.unsplash.com/..." value={heroEvent.backgroundImage}
                            onChange={(e) => setHeroEvent({ ...heroEvent, backgroundImage: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '🚀 Create'}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Hero Events</h3>
                    <div className="space-y-3">
                      {[currentEvent, ...upcomingEvents, ...previousEvents].filter(Boolean).map((ev) => (
                        <div key={ev.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold">{ev.title}</h4>
                            <p className="text-xs text-gray-400">{formatDate(ev.eventDate)} • {ev.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditHeroEvent(ev)} className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteHeroEvent(ev.id)} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {[currentEvent, ...upcomingEvents, ...previousEvents].filter(Boolean).length === 0 && (
                        <p className="text-center text-gray-500 py-8">No events yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── TICKETS TAB ── */}
              {activeTab === 'tickets' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddTicket} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Ticket' : '🎫 Add Ticket'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Pass Name</label>
                          <input type="text" placeholder="VIP Pass" value={ticket.name}
                            onChange={(e) => setTicket({ ...ticket, name: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Price</label>
                          <input type="text" placeholder="₹500" value={ticket.price}
                            onChange={(e) => setTicket({ ...ticket, price: e.target.value })} className={inputCls} required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Features (comma separated)</label>
                          <textarea placeholder="Entry, Welcome Drink, VIP Seating" value={ticket.features}
                            onChange={(e) => setTicket({ ...ticket, features: e.target.value })}
                            rows="3" className={inputCls} required />
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" id="featured" checked={ticket.featured}
                            onChange={(e) => setTicket({ ...ticket, featured: e.target.checked })} className="w-5 h-5" />
                          <label htmlFor="featured" className="text-sm">Mark as Featured</label>
                        </div>
                        <EventSelector value={ticket.eventId} onChange={(val) => setTicket({ ...ticket, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '✨ Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Tickets ({tickets.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="bg-black/40 border border-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold">{t.name}</h4>
                            {t.featured && <span className="bg-amber-500 text-black text-xs px-2 py-1 rounded">Featured</span>}
                          </div>
                          <p className="text-amber-500 font-bold text-lg mb-2">{t.price}</p>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => handleEditTicket(t)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteTicket(t.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {tickets.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No tickets yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── NEWS TAB ── */}
              {activeTab === 'news' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddNews} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit News' : '📰 Post News'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Category</label>
                          <select value={news.cat} onChange={(e) => setNews({ ...news, cat: e.target.value })} className={inputCls}>
                            <option>Announcement</option><option>Alert</option><option>Food</option>
                            <option>DJ Night</option><option>Games</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Title/Message</label>
                          <textarea placeholder="DJ Night starts in 10 minutes! 🎵" value={news.title}
                            onChange={(e) => setNews({ ...news, title: e.target.value })}
                            rows="3" className={inputCls} required />
                        </div>
                        <EventSelector value={news.eventId} onChange={(val) => setNews({ ...news, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '📢 Broadcast'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All News ({newsList.length})</h3>
                    <div className="space-y-3">
                      {newsList.map((n) => (
                        <div key={n.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded">{n.cat}</span>
                              <span className="text-xs text-gray-500">{n.date}</span>
                            </div>
                            <p className="text-sm">{n.title}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => handleEditNews(n)} className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteNews(n.id)} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {newsList.length === 0 && <p className="text-center text-gray-500 py-8">No news yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── TIMELINE EVENTS TAB ── */}
              {activeTab === 'events' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddEvent} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Timeline Event' : '⏰ Add Timeline Event'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Time</label>
                          <input type="text" placeholder="7:00 PM" value={event.time}
                            onChange={(e) => setEvent({ ...event, time: e.target.value })} className={inputCls} required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                          <input type="text" placeholder="Entry & Welcome" value={event.title}
                            onChange={(e) => setEvent({ ...event, title: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Icon</label>
                          <input type="text" placeholder="fa-music" value={event.icon}
                            onChange={(e) => setEvent({ ...event, icon: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                          <input type="number" value={event.order}
                            onChange={(e) => setEvent({ ...event, order: e.target.value })} className={inputCls} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Description</label>
                          <input type="text" placeholder="Brief details..." value={event.desc}
                            onChange={(e) => setEvent({ ...event, desc: e.target.value })} className={inputCls} />
                        </div>
                        <EventSelector value={event.eventId} onChange={(val) => setEvent({ ...event, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '🎯 Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Timeline Events ({timelineEvents.length})</h3>
                    <div className="space-y-3">
                      {timelineEvents.map((ev) => (
                        <div key={ev.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <i className={`fa-solid ${ev.icon} text-amber-500 text-2xl`}></i>
                            <div>
                              <h4 className="font-bold">{ev.time} — {ev.title}</h4>
                              <p className="text-xs text-gray-400">{ev.desc}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditTimelineEvent(ev)} className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteTimelineEvent(ev.id)} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {timelineEvents.length === 0 && <p className="text-center text-gray-500 py-8">No timeline events yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── VIDEOS TAB ── */}
              {activeTab === 'videos' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddVideo} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Video' : '🎬 Add Video'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Video URL</label>
                          <input type="url" placeholder="https://example.com/video.mp4" value={videoHighlight.url}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, url: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Title</label>
                          <input type="text" placeholder="DJ Night Highlights" value={videoHighlight.title}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, title: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Orientation</label>
                          <select value={videoHighlight.orientation}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, orientation: e.target.value })} className={inputCls}>
                            <option value="landscape">Landscape (16:9)</option>
                            <option value="portrait">Portrait (9:16)</option>
                            <option value="square">Square (1:1)</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Description</label>
                          <textarea placeholder="Brief description..." value={videoHighlight.description}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, description: e.target.value })}
                            rows="2" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Thumbnail URL</label>
                          <input type="url" placeholder="https://..." value={videoHighlight.thumbnail}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, thumbnail: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                          <input type="number" value={videoHighlight.order}
                            onChange={(e) => setVideoHighlight({ ...videoHighlight, order: e.target.value })} className={inputCls} />
                        </div>
                        <EventSelector value={videoHighlight.eventId} onChange={(val) => setVideoHighlight({ ...videoHighlight, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '🎬 Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Videos ({videos.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map((v) => (
                        <div key={v.id} className="bg-black/40 border border-white/10 rounded-xl p-4">
                          <h4 className="font-bold mb-1">{v.title}</h4>
                          <p className="text-xs text-gray-400 mb-2">{v.orientation} • Order: {v.order}</p>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => handleEditVideo(v)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteVideo(v.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {videos.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No videos yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── SPEAKERS TAB ── */}
              {activeTab === 'speakers' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddSpeaker} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Speaker' : '🎤 Add Speaker'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Name</label>
                          <input type="text" placeholder="Dr. Rajesh Kumar" value={speaker.name}
                            onChange={(e) => setSpeaker({ ...speaker, name: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Role</label>
                          <input type="text" placeholder="Chief Guest" value={speaker.role}
                            onChange={(e) => setSpeaker({ ...speaker, role: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Photo URL</label>
                          <input type="url" placeholder="https://..." value={speaker.img}
                            onChange={(e) => setSpeaker({ ...speaker, img: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                          <input type="number" value={speaker.order}
                            onChange={(e) => setSpeaker({ ...speaker, order: e.target.value })} className={inputCls} />
                        </div>
                        <EventSelector value={speaker.eventId} onChange={(val) => setSpeaker({ ...speaker, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '🎤 Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Speakers ({speakers.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {speakers.map((s) => (
                        <div key={s.id} className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                          <img src={s.img} alt={s.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
                          <h4 className="font-bold text-sm">{s.name}</h4>
                          <p className="text-xs text-gray-400 mb-3">{s.role}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSpeaker(s)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteSpeaker(s.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {speakers.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No speakers yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── TEAM TAB ── */}
              {activeTab === 'team' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddTeamMember} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Team Member' : '👥 Add Team Member'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Name</label>
                          <input type="text" placeholder="Prem Prakash" value={teamMember.name}
                            onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Role</label>
                          <input type="text" placeholder="Event Coordinator" value={teamMember.role}
                            onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Photo URL</label>
                          <input type="url" placeholder="https://..." value={teamMember.img}
                            onChange={(e) => setTeamMember({ ...teamMember, img: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Order</label>
                          <input type="number" value={teamMember.order}
                            onChange={(e) => setTeamMember({ ...teamMember, order: e.target.value })} className={inputCls} />
                        </div>
                        <EventSelector value={teamMember.eventId} onChange={(val) => setTeamMember({ ...teamMember, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '👥 Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Team Members ({teamMembers.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {teamMembers.map((t) => (
                        <div key={t.id} className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                          <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                          <h4 className="font-bold text-sm">{t.name}</h4>
                          <p className="text-xs text-gray-400 mb-3">{t.role}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditTeamMember(t)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteTeamMember(t.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {teamMembers.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No team members yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── GALLERY TAB ── */}
              {activeTab === 'gallery' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddGalleryImage} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Photo' : '📸 Add Photo'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Image URL</label>
                          <input type="url" placeholder="https://..." value={galleryImage.url}
                            onChange={(e) => setGalleryImage({ ...galleryImage, url: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Description</label>
                          <input type="text" placeholder="DJ Night Vibes" value={galleryImage.alt}
                            onChange={(e) => setGalleryImage({ ...galleryImage, alt: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Category</label>
                          <select value={galleryImage.category}
                            onChange={(e) => setGalleryImage({ ...galleryImage, category: e.target.value })} className={inputCls}>
                            <option value="party">Party</option><option value="dance">Dance</option>
                            <option value="dj">DJ</option><option value="food">Food</option><option value="games">Games</option>
                          </select>
                        </div>
                        <EventSelector value={galleryImage.eventId} onChange={(val) => setGalleryImage({ ...galleryImage, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '📸 Add'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Photos ({galleryImages.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryImages.map((g) => (
                        <div key={g.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                          <img src={g.url} alt={g.alt} className="w-full h-32 object-cover" />
                          <div className="p-3">
                            <p className="text-xs text-gray-400 mb-2">{g.category}</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditGalleryImage(g)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Edit</button>
                              <button onClick={() => handleDeleteGalleryImage(g.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-all">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {galleryImages.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No photos yet</p>}
                    </div>
                  </div>
                </>
              )}

              {/* ── SPONSORS TAB ── */}
              {activeTab === 'sponsors' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleAddSponsor} className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{editMode ? '✏️ Edit Sponsor' : '🤝 Add Sponsor'}</h2>
                        {editMode && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Company Name</label>
                          <input type="text" placeholder="Acme Corporation" value={sponsor.name}
                            onChange={(e) => setSponsor({ ...sponsor, name: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Logo URL</label>
                          <input type="url" placeholder="https://..." value={sponsor.logo}
                            onChange={(e) => setSponsor({ ...sponsor, logo: e.target.value })} className={inputCls} required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Website (Optional)</label>
                          <input type="url" placeholder="https://company.com" value={sponsor.website}
                            onChange={(e) => setSponsor({ ...sponsor, website: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Sponsorship Tier</label>
                          <select value={sponsor.tier} onChange={(e) => setSponsor({ ...sponsor, tier: e.target.value })} className={inputCls}>
                            <option value="platinum">Platinum (Top Tier)</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 uppercase">Display Order</label>
                          <input type="number" value={sponsor.order}
                            onChange={(e) => setSponsor({ ...sponsor, order: e.target.value })} className={inputCls} />
                        </div>
                        <EventSelector value={sponsor.eventId} onChange={(val) => setSponsor({ ...sponsor, eventId: val })} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : editMode ? '💾 Update' : '🤝 Add Sponsor'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">All Sponsors ({sponsors.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sponsors.map((s) => (
                        <div key={s.id} className="bg-black/40 border border-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${s.tier === 'platinum' ? 'bg-gray-400 text-black' : s.tier === 'gold' ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'}`}>
                              {s.tier}
                            </span>
                          </div>
                          <img src={s.logo} alt={s.name} className="w-full h-20 object-contain mb-2 filter grayscale" />
                          <h4 className="font-bold text-sm">{s.name}</h4>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => handleEditSponsor(s)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteSponsor(s.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                      {sponsors.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No sponsors yet</p>}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR — EVENT MONITOR ── */}
        <div className="w-80 bg-black/40 border-l border-white/10 p-6 h-screen sticky top-0 overflow-y-auto">
          <h3 className="text-lg font-bold mb-6 text-amber-500">📅 Event Monitor</h3>

          {/* Current Event */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Current Event
            </h4>
            {currentEvent ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">{currentEvent.title}</h5>
                <p className="text-xs text-gray-400 mb-3">📍 {currentEvent.location}<br />📅 {formatDate(currentEvent.eventDate)}</p>
                {linkedItemsCounts[currentEvent.id] && (
                  <div className="mb-3 p-2 bg-white/5 rounded-lg">
                    <p className="text-xs font-bold text-gray-400 mb-1">Linked Items:</p>
                    {Object.entries(linkedItemsCounts[currentEvent.id]).map(([col, count]) => (
                      <p key={col} className="text-xs text-gray-500">• {count} {col}</p>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEditHeroEvent(currentEvent)} className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">✏️ Edit</button>
                  <button onClick={() => handleDeleteHeroEvent(currentEvent.id)} disabled={loading} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50">🗑️ Delete</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No current event</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">⏭️ Upcoming ({upcomingEvents.length})</h4>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <h5 className="font-bold text-sm text-white mb-1">{ev.title}</h5>
                    <p className="text-xs text-gray-500 mb-2">
                      📅 {formatDate(ev.eventDate)}
                      {linkedItemsCounts[ev.id] && (
                        <><br />📎 {Object.values(linkedItemsCounts[ev.id]).reduce((s, c) => s + c, 0)} items</>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditHeroEvent(ev)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded text-xs">Edit</button>
                      <button onClick={() => handleDeleteHeroEvent(ev.id)} disabled={loading} className="flex-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded text-xs disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No upcoming events</p>
            )}
          </div>

          {/* Previous Events */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">⏮️ Previous ({previousEvents.length})</h4>
            {previousEvents.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {previousEvents.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3">
                    <h5 className="font-bold text-xs text-gray-300">{ev.title}</h5>
                    <p className="text-xs text-gray-600">{formatDate(ev.eventDate)}</p>
                    <button onClick={() => handleDeleteHeroEvent(ev.id)} disabled={loading}
                      className="mt-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs disabled:opacity-50">
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