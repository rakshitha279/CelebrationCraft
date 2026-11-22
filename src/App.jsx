import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import PackageCard from './components/PackageCard.jsx';
import { starterEvents, categories } from './data.js';

const readEvents = () => {
  try { const saved = JSON.parse(localStorage.getItem('cc-events') || 'null'); return Array.isArray(saved) ? saved : starterEvents; }
  catch { return starterEvents; }
};
const money = value => `₹${Number(value).toLocaleString('en-IN')}`;

export default function App() {
  const [page,setPage] = useState(window.location.pathname);
  const [events,setEvents] = useState(readEvents);
  const [search,setSearch] = useState('');
  const [booking,setBooking] = useState({name:'',date:'',guests:'',category:'',email:''});
  const [notice,setNotice] = useState('');
  const [custom,setCustom] = useState({title:'',category:'',price:'',description:'',icon:'🎉'});
  const [selectedPackage,setSelectedPackage] = useState('');

  useEffect(() => {
    const onPop = () => { setPage(window.location.pathname); setNotice(''); };
    window.addEventListener('popstate',onPop);
    return () => window.removeEventListener('popstate',onPop);
  },[]);
  useEffect(() => { localStorage.setItem('cc-events',JSON.stringify(events)); },[events]);

  function navigate(path) {
    if (window.location.pathname !== path) window.history.pushState({},'',path);
    setPage(path); setNotice(''); window.scrollTo({top:0,behavior:'smooth'});
  }
  function startBooking(event) {
    setSelectedPackage(event?.title || '');
    setBooking(old=>({...old,category:event?.category || old.category}));
    navigate('/book');
  }
  const visibleEvents = useMemo(() => events.filter(e => `${e.title} ${e.category}`.toLowerCase().includes(search.toLowerCase().trim())),[events,search]);
  const today = new Date().toISOString().slice(0,10);

  function submitBooking(e) {
    e.preventDefault();
    if (!booking.name.trim() || !booking.email.trim() || !booking.date || !booking.guests || !booking.category) {
      setNotice('Please complete every required field.'); return;
    }
    if (booking.date < today || Number(booking.guests) < 1) {
      setNotice('Choose a future date and enter at least one guest.'); return;
    }
    const requests = JSON.parse(localStorage.getItem('cc-bookings') || '[]');
    requests.push({...booking, packageName:selectedPackage, createdAt:new Date().toISOString()});
    localStorage.setItem('cc-bookings',JSON.stringify(requests));
    setNotice(`Thanks, ${booking.name.trim()}! Your booking request has been recorded.`);
    setBooking({name:'',date:'',guests:'',category:'',email:''}); setSelectedPackage('');
  }
  function submitCustom(e) {
    e.preventDefault();
    const item = {...custom,id:Date.now(),price:Number(custom.price)};
    setEvents(old=>[item,...old]);
    setCustom({title:'',category:'',price:'',description:'',icon:'🎉'});
    setNotice('Your celebration theme has been added to the package catalog.');
    navigate('/events');
  }

  return <><Header page={page} navigate={navigate}/>{page==='/' ? <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">YOUR DAY, YOUR WAY</p><h1>Make room for<br/><em>moments that matter.</em></h1><p className="hero-intro">From joyful birthdays to meaningful traditions, find a celebration package that feels like you.</p><div className="hero-actions"><button className="button" onClick={()=>navigate('/events')}>Explore celebrations <span>↗</span></button><button className="text-button" onClick={()=>navigate('/create')}>Create your own theme</button></div><div className="hero-proof"><span>✳</span> Thoughtful themes. Memorable gatherings.</div></div><div className="hero-art"><div className="art-circle"></div><div className="art-card"><span>✦</span><b>CELEBRATE<br/>THE LITTLE<br/>THINGS</b><small>EST. FOR YOUR MOMENTS</small></div><div className="art-sticker">MAKE IT<br/>SPECIAL ✿</div></div></section>
    <section className="section category-section"><div className="section-head"><div><p className="eyebrow">FIND YOUR OCCASION</p><h2>Every reason is a <em>good reason.</em></h2></div><button className="text-button" onClick={()=>navigate('/events')}>View all packages ↗</button></div><div className="category-grid">{categories.map((c,i)=><button className="category-tile" key={c.name} onClick={()=>{setSearch(c.name);navigate('/events')}}><span className="category-symbol">{c.icon}</span><span className="category-index">0{i+1} / OCCASION</span><b>{c.name}</b><small>{c.note}</small><span className="tile-arrow">↗</span></button>)}</div></section>
    <section className="closing-banner"><div><p className="eyebrow">A CELEBRATION STARTS WITH AN IDEA</p><h2>Have something different in mind?</h2><p>Build a custom theme and add it to the collection.</p></div><button className="button button-cream" onClick={()=>navigate('/create')}>Design a package ↗</button></section>
  </main> : page==='/events' ? <main className="inner-page"><div className="page-heading"><p className="eyebrow">THE CELEBRATION COLLECTION</p><h1>Find your <em>kind of joy.</em></h1><p>Browse the packages and choose the one that suits your moment.</p><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by event or category..." aria-label="Search packages"/></div><div className="results-line"><b>Available packages</b><span>{visibleEvents.length} result{visibleEvents.length===1?'':'s'}</span></div>{visibleEvents.length ? <div className="package-grid">{visibleEvents.map(ev=><PackageCard key={ev.id} event={ev} onBook={startBooking}/>)}</div> : <div className="empty-state"><span>⌕</span><h2>No matching packages</h2><p>Try another event name or category.</p><button className="text-button" onClick={()=>setSearch('')}>Clear search</button></div>}</main>
  : page==='/book' ? <main className="inner-page form-page"><div className="page-heading"><p className="eyebrow">LET'S PLAN SOMETHING LOVELY</p><h1>Make it <em>official.</em></h1><p>Share a few details and send us your booking request.</p></div><form className="form-panel" onSubmit={submitBooking}><div className="form-title"><span>01</span><div><h2>Booking details</h2><p>Fields marked * are required.</p></div></div>{selectedPackage&&<p className="selected-package">Selected package: <b>{selectedPackage}</b></p>}<div className="form-grid"><label>Full name *<input value={booking.name} onChange={e=>setBooking({...booking,name:e.target.value})} required minLength="2" placeholder="Your name"/></label><label>Email address *<input type="email" value={booking.email} onChange={e=>setBooking({...booking,email:e.target.value})} required placeholder="you@example.com"/></label><label>Event date *<input type="date" min={today} value={booking.date} onChange={e=>setBooking({...booking,date:e.target.value})} required/></label><label>Number of guests *<input type="number" min="1" max="10000" value={booking.guests} onChange={e=>setBooking({...booking,guests:e.target.value})} required placeholder="e.g. 80"/></label><label className="full-field">Celebration type *<select value={booking.category} onChange={e=>setBooking({...booking,category:e.target.value})} required><option value="">Choose an occasion</option>{categories.map(c=><option key={c.name}>{c.name}</option>)}<option>Other</option></select></label></div><button className="button form-submit" type="submit">Send booking request ↗</button>{notice&&<p className="notice" role="status">{notice}</p>}</form></main>
  : page==='/create' ? <main className="inner-page form-page"><div className="page-heading"><p className="eyebrow">MAKE IT YOURS</p><h1>Dream it. <em>We'll list it.</em></h1><p>Add a custom celebration package to the live collection.</p></div><form className="form-panel" onSubmit={submitCustom}><div className="form-title"><span>02</span><div><h2>New celebration theme</h2><p>Your new package will appear in Explore packages.</p></div></div><div className="form-grid"><label>Package name *<input value={custom.title} onChange={e=>setCustom({...custom,title:e.target.value})} required minLength="2" placeholder="e.g. Garden Anniversary"/></label><label>Celebration category *<input value={custom.category} onChange={e=>setCustom({...custom,category:e.target.value})} required placeholder="e.g. Anniversary"/></label><label>Base price (₹) *<input type="number" min="1" value={custom.price} onChange={e=>setCustom({...custom,price:e.target.value})} required placeholder="Enter amount"/></label><label>Choose an icon<select value={custom.icon} onChange={e=>setCustom({...custom,icon:e.target.value})}><option>🎉</option><option>🎂</option><option>🌼</option><option>💍</option><option>🍼</option><option>🎈</option><option>✨</option></select></label><label className="full-field">Package description *<textarea rows="4" value={custom.description} onChange={e=>setCustom({...custom,description:e.target.value})} required minLength="8" placeholder="Describe the experience and what the package includes..."/></label></div><button className="button form-submit" type="submit">Add package to catalog ↗</button>{notice&&<p className="notice" role="status">{notice}</p>}</form></main>
  : <main className="inner-page empty-state"><span>404</span><h1>That page isn't here.</h1><button className="button" onClick={()=>navigate('/')}>Back to home</button></main>}
  <footer className="footer"><span>celebration<span className="brand-light">craft</span></span><small>Made for the moments worth remembering.</small><button onClick={()=>navigate('/events')}>Explore packages ↗</button></footer></>;
}
