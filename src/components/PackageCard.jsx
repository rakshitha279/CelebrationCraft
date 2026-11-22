export default function PackageCard({ event, onBook }) {
  return <article className="package-card"><div className="package-top"><span className="package-icon">{event.icon}</span><span className="tag">{event.category}</span></div>
    <h3>{event.title}</h3><p>{event.description}</p><div className="package-bottom"><strong>₹{Number(event.price).toLocaleString('en-IN')}</strong><button className="button button-small" onClick={()=>onBook(event)}>Book this package ↗</button></div>
  </article>;
}
