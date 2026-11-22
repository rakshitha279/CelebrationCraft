export default function Header({ page, navigate }) {
  const links = [['Home','/'], ['Explore packages','/events'], ['Book an event','/book'], ['Create a theme','/create']];
  return <header className="topbar"><button className="brand" onClick={() => navigate('/')} aria-label="CelebrationCraft home"><span className="brand-mark">C</span><span>celebration<span className="brand-light">craft</span></span></button>
    <nav>{links.map(([label,path]) => <button key={path} className={page===path?'nav-link active':'nav-link'} onClick={()=>navigate(path)}>{label}</button>)}</nav>
  </header>;
}
