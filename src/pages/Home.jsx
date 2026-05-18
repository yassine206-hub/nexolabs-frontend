import { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function Home() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('nx-theme') === 'dark';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [form, setForm] = useState({
    prenom:'', nom:'', contact:'', secteur:'', service:'', message:''
  });
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState({});
  const heroRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nx-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(prev => ({ ...prev, [e.target.dataset.id]: true }));
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const v = dark ? D : L;

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ prenom:'', nom:'', contact:'', secteur:'', service:'', message:'' });
    } catch { setStatus('error'); }
  };

  const fadeUp = id => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? 'translateY(0)' : 'translateY(40px)',
    transition: 'opacity .7s ease, transform .7s ease',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { font-family:'Sora',sans-serif; overflow-x:hidden; }

        /* NAV */
        .nx-nav {
          position:fixed; top:0; left:0; right:0; z-index:999;
          height:68px; display:flex; align-items:center;
          justify-content:space-between; padding:0 6%;
          background:${dark ? 'rgba(10,18,35,0.92)' : 'rgba(255,255,255,0.92)'};
          backdrop-filter:blur(20px);
          border-bottom:1px solid ${v.border};
          box-shadow:${scrolled ? `0 2px 30px rgba(26,107,255,0.1)` : 'none'};
          transition:box-shadow .3s, background .3s;
        }
        .nx-logo { font-size:22px; font-weight:700; letter-spacing:-.5px; color:${v.dark}; }
        .nx-logo span {
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-nav-links { display:flex; align-items:center; gap:2rem; list-style:none; }
        .nx-nav-links a {
          font-size:14px; font-weight:500; color:${v.text2};
          text-decoration:none; transition:color .2s; cursor:pointer;
        }
        .nx-nav-links a:hover { color:#1a6bff; }
        .nx-nav-cta {
          background:linear-gradient(90deg,#1a6bff,#0040cc);
          color:#fff !important; padding:9px 20px; border-radius:8px;
          font-size:14px !important; font-weight:600 !important;
          transition:all .2s !important; cursor:pointer;
          box-shadow:0 4px 15px rgba(26,107,255,0.3);
        }
        .nx-nav-cta:hover {
          background:linear-gradient(90deg,#3d82ff,#1a6bff) !important;
          box-shadow:0 6px 25px rgba(26,107,255,0.5);
          transform:translateY(-1px);
        }
        .nx-toggle-btn {
          display:flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:8px; font-size:13px;
          font-weight:500; cursor:pointer; font-family:'Sora',sans-serif;
          background:${dark ? 'rgba(26,107,255,0.15)' : '#e8f0fe'};
          color:${dark ? '#7ab3ff' : '#1a6bff'};
          border:1px solid ${v.border}; transition:all .2s;
        }
        .nx-toggle-btn:hover { transform:translateY(-1px); }
        .nx-burger {
          display:none; flex-direction:column; gap:5px;
          background:none; border:none; cursor:pointer; padding:4px;
        }
        .nx-burger span { display:block; width:24px; height:2px; background:${v.dark}; border-radius:2px; }

        /* MOBILE */
        .nx-mobile-menu {
          display:${menuOpen ? 'flex' : 'none'};
          position:fixed; top:68px; left:0; right:0;
          background:${dark ? '#0a1223' : '#fff'};
          border-bottom:1px solid ${v.border};
          padding:1.25rem 6%; z-index:998;
          flex-direction:column; gap:.75rem;
          box-shadow:0 8px 30px rgba(26,107,255,0.1);
        }
        .nx-mobile-menu a {
          font-size:15px; font-weight:500; color:${v.text2};
          text-decoration:none; padding:.4rem 0;
          border-bottom:1px solid ${v.border}; cursor:pointer;
        }
        .nx-mobile-menu a:last-child { color:#1a6bff; font-weight:600; border-bottom:none; }

        /* HERO */
        .nx-hero {
          padding:140px 6% 120px; position:relative; overflow:hidden;
          background:${dark
            ? 'linear-gradient(135deg,#050d1a 0%,#0a1628 50%,#0d1b2e 100%)'
            : 'linear-gradient(135deg,#f0f5ff 0%,#ffffff 50%,#e8f0fe 100%)'};
        }
        .nx-hero-orb1 {
          position:absolute; width:700px; height:700px; border-radius:50%;
          background:radial-gradient(circle,rgba(26,107,255,0.12) 0%,transparent 70%);
          top:-200px; right:-150px; pointer-events:none;
          animation:orbFloat 8s ease-in-out infinite;
        }
        .nx-hero-orb2 {
          position:absolute; width:400px; height:400px; border-radius:50%;
          background:radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%);
          bottom:-100px; left:-100px; pointer-events:none;
          animation:orbFloat 10s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%,100%{transform:translate(0,0) scale(1)}
          50%{transform:translate(30px,-30px) scale(1.05)}
        }

        .nx-hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:${dark ? 'rgba(26,107,255,0.12)' : '#e8f0fe'};
          border:1px solid ${dark ? 'rgba(26,107,255,0.25)' : '#d4e0ff'};
          border-radius:20px; padding:5px 14px;
          font-size:12px; font-family:'DM Mono',monospace;
          color:#1a6bff; margin-bottom:1.75rem;
        }
        .nx-badge-dot {
          width:7px; height:7px; background:#1a6bff;
          border-radius:50%; animation:pulse 2s infinite;
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}

        .nx-hero h1 {
          font-size:clamp(38px,5.5vw,76px); font-weight:700;
          line-height:1.06; letter-spacing:-2px;
          max-width:820px; margin-bottom:1.25rem; color:${v.dark};
        }
        .nx-hero h1 .grad {
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-hero-sub {
          font-size:18px; color:${v.text2};
          max-width:540px; line-height:1.75; margin-bottom:2.5rem;
        }
        .nx-hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:4rem; }

        .nx-btn-primary {
          background:linear-gradient(90deg,#1a6bff,#0040cc);
          color:#fff; padding:14px 28px; border-radius:10px;
          font-size:15px; font-weight:600; display:inline-flex;
          align-items:center; gap:8px; border:none;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 4px 20px rgba(26,107,255,0.35);
          transition:all .25s;
        }
        .nx-btn-primary:hover {
          transform:translateY(-3px);
          box-shadow:0 8px 35px rgba(26,107,255,0.5);
        }
        .nx-btn-outline {
          background:transparent; color:#1a6bff; padding:14px 28px;
          border-radius:10px; font-size:15px; font-weight:600;
          display:inline-flex; align-items:center; gap:8px;
          border:1.5px solid #1a6bff; cursor:pointer;
          font-family:'Sora',sans-serif; transition:all .25s;
        }
        .nx-btn-outline:hover {
          background:${dark ? 'rgba(26,107,255,0.1)' : '#e8f0fe'};
          transform:translateY(-3px);
          box-shadow:0 4px 20px rgba(26,107,255,0.15);
        }

        .nx-hero-trust {
          display:flex; align-items:center; gap:2.5rem; flex-wrap:wrap;
          border-top:1px solid ${v.border}; padding-top:2rem;
        }
        .nx-trust-item { display:flex; align-items:center; gap:8px; font-size:13px; color:${v.text2}; }
        .nx-trust-icon {
          width:34px; height:34px;
          background:${dark ? 'rgba(26,107,255,0.15)' : '#e8f0fe'};
          border-radius:8px; display:flex; align-items:center;
          justify-content:center; font-size:16px;
        }

        /* 3D CARD EFFECT */
        .nx-3d {
          transform-style:preserve-3d;
          transition:transform .3s ease, box-shadow .3s ease;
        }
        .nx-3d:hover {
          transform:perspective(800px) rotateX(-3deg) rotateY(3deg) translateY(-6px);
        }

        /* GRADIENT BORDER */
        .nx-grad-border {
          position:relative;
          background:${dark ? '#0f1e38' : '#fff'};
          border-radius:16px;
        }
        .nx-grad-border::before {
          content:''; position:absolute; inset:-1.5px;
          border-radius:17px;
          background:linear-gradient(135deg,#1a6bff,#00d4ff,#1a6bff);
          z-index:-1; opacity:0; transition:opacity .3s;
        }
        .nx-grad-border:hover::before { opacity:1; }

        /* SECTIONS */
        .nx-section { padding:100px 6%; }
        .nx-bg-alt { background:${dark ? '#0a1223' : '#f5f8ff'}; }
        .nx-bg-white { background:${v.white}; }

        .nx-section-label {
          display:inline-flex; align-items:center; gap:8px;
          font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
          letter-spacing:2px; text-transform:uppercase; margin-bottom:.9rem;
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-section-label::before {
          content:''; width:20px; height:2px; border-radius:2px;
          background:linear-gradient(90deg,#1a6bff,#00d4ff); flex-shrink:0;
        }
        .nx-section-title {
          font-size:clamp(28px,3.5vw,48px); font-weight:700;
          letter-spacing:-1px; line-height:1.1; color:${v.dark}; margin-bottom:.75rem;
        }
        .nx-section-title .grad {
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-section-sub { font-size:16px; color:${v.text2}; max-width:520px; line-height:1.75; margin-bottom:3rem; }

        /* SECTORS */
        .nx-sectors-intro { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; margin-bottom:3rem; }
        .nx-sectors-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .nx-sector-card {
          background:${v.white}; border:1px solid ${v.border};
          border-radius:14px; padding:1.5rem 1.25rem; text-align:center;
          position:relative; overflow:hidden; cursor:default;
          transition:all .3s;
        }
        .nx-sector-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          transform:scaleX(0); transition:transform .3s;
        }
        .nx-sector-card:hover {
          box-shadow:0 10px 40px rgba(26,107,255,0.15);
          transform:translateY(-5px); border-color:rgba(26,107,255,0.4);
        }
        .nx-sector-card:hover::after { transform:scaleX(1); }
        .nx-sector-icon { font-size:32px; margin-bottom:.75rem; display:block; }
        .nx-sector-name { font-size:13px; font-weight:600; color:${v.dark}; line-height:1.4; }

        /* SERVICES */
        .nx-services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .nx-service-card {
          background:${dark ? '#0f1e38' : '#fff'}; border:1px solid ${v.border};
          border-radius:16px; padding:2rem;
          transition:all .3s; position:relative; overflow:hidden;
        }
        .nx-service-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          transform:scaleX(0); transition:transform .3s; transform-origin:left;
        }
        .nx-service-card:hover {
          box-shadow:0 12px 40px rgba(26,107,255,0.15);
          transform:translateY(-5px); border-color:rgba(26,107,255,0.3);
        }
        .nx-service-card:hover::before { transform:scaleX(1); }
        .nx-service-icon-wrap {
          width:52px; height:52px;
          background:${dark ? 'rgba(26,107,255,0.15)' : '#e8f0fe'};
          border-radius:12px; display:flex; align-items:center;
          justify-content:center; font-size:24px; margin-bottom:1.25rem;
        }
        .nx-service-name { font-size:17px; font-weight:700; color:${v.dark}; margin-bottom:.5rem; }
        .nx-service-desc { font-size:13px; color:${v.text2}; line-height:1.7; margin-bottom:1.25rem; }
        .nx-service-features { list-style:none; padding:0; }
        .nx-service-features li {
          font-size:12px; color:${v.text2}; padding:4px 0;
          display:flex; align-items:center; gap:7px;
          border-top:1px solid ${dark ? 'rgba(100,150,255,0.08)' : '#eef3ff'};
        }
        .nx-service-features li:first-child { border-top:none; }
        .nx-service-features li::before { content:'✓'; color:#1a6bff; font-weight:700; font-size:11px; flex-shrink:0; }

        /* PROCESS */
        .nx-process-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative; }
        .nx-process-steps::before {
          content:''; position:absolute; top:28px; left:12%; right:12%; height:2px;
          background:linear-gradient(90deg,#1a6bff,#00d4ff); z-index:0;
        }
        .nx-process-step { text-align:center; padding:0 1rem; position:relative; z-index:1; }
        .nx-step-number {
          width:56px; height:56px;
          background:linear-gradient(135deg,#1a6bff,#0040cc);
          color:#fff; border-radius:50%; display:flex; align-items:center;
          justify-content:center; font-family:'DM Mono',monospace;
          font-size:16px; font-weight:500; margin:0 auto 1.25rem;
          box-shadow:0 0 0 6px ${dark ? '#0a1223' : '#f5f8ff'},0 4px 20px rgba(26,107,255,0.4);
          transition:transform .3s, box-shadow .3s;
        }
        .nx-process-step:hover .nx-step-number {
          transform:scale(1.1);
          box-shadow:0 0 0 8px ${dark ? '#0a1223' : '#f5f8ff'},0 6px 30px rgba(26,107,255,0.6);
        }
        .nx-step-title { font-size:15px; font-weight:700; color:${v.dark}; margin-bottom:.4rem; }
        .nx-step-desc { font-size:13px; color:${v.text2}; line-height:1.65; }

        /* WHY */
        .nx-why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .nx-why-card {
          background:${dark ? '#0a1223' : '#f5f8ff'};
          border-radius:14px; padding:1.75rem;
          border:1px solid ${v.border};
          transition:all .3s;
        }
        .nx-why-card:hover {
          transform:translateY(-4px);
          box-shadow:0 10px 30px rgba(26,107,255,0.1);
          border-color:rgba(26,107,255,0.3);
        }
        .nx-why-icon { font-size:28px; margin-bottom:1rem; }
        .nx-why-title { font-size:15px; font-weight:700; color:${v.dark}; margin-bottom:.4rem; }
        .nx-why-desc { font-size:13px; color:${v.text2}; line-height:1.7; }

        /* CONTACT */
        .nx-contact-wrap { display:grid; grid-template-columns:1fr 1.4fr; gap:4rem; align-items:start; }
        .nx-contact-info-title { font-size:22px; font-weight:700; color:${v.dark}; margin-bottom:.75rem; }
        .nx-contact-info-desc { font-size:14px; color:${v.text2}; line-height:1.8; margin-bottom:2rem; }
        .nx-contact-item {
          display:flex; align-items:center; gap:12px; padding:.85rem 0;
          border-bottom:1px solid ${v.border}; font-size:14px; color:${v.text2};
        }
        .nx-contact-item:last-of-type { border-bottom:none; }
        .nx-contact-item-icon {
          width:36px; height:36px;
          background:${dark ? 'rgba(26,107,255,0.15)' : '#e8f0fe'};
          border-radius:8px; display:flex; align-items:center;
          justify-content:center; font-size:16px; flex-shrink:0;
        }
        .nx-contact-note {
          margin-top:1.5rem;
          background:${dark ? 'rgba(26,107,255,0.08)' : '#e8f0fe'};
          border:1px solid ${v.border}; border-radius:10px; padding:1rem 1.25rem;
        }
        .nx-contact-note-label {
          font-size:10px; font-family:'DM Mono',monospace; letter-spacing:1.5px;
          text-transform:uppercase; margin-bottom:.4rem;
          background:linear-gradient(90deg,#1a6bff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-contact-note-text { font-size:13px; color:${v.dark}; font-weight:500; }
        .nx-contact-note-sub { font-size:12px; color:${v.text2}; margin-top:2px; }

        .nx-contact-form {
          background:${dark ? '#0f1e38' : '#fff'};
          border:1px solid ${v.border}; border-radius:16px; padding:2rem;
          box-shadow:0 4px 30px rgba(26,107,255,0.08);
        }
        .nx-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .nx-form-group { margin-bottom:14px; }
        .nx-form-label { font-size:12px; font-weight:600; color:${v.text2}; display:block; margin-bottom:6px; }
        .nx-form-input, .nx-form-select, .nx-form-textarea {
          width:100%; padding:10px 14px; border:1.5px solid ${v.border};
          border-radius:8px; font-size:14px; font-family:'Sora',sans-serif;
          color:${v.dark}; background:${dark ? '#0a1628' : '#fff'};
          outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .nx-form-input:focus, .nx-form-select:focus, .nx-form-textarea:focus {
          border-color:#1a6bff; box-shadow:0 0 0 3px rgba(26,107,255,0.12);
        }
        .nx-form-textarea { resize:vertical; min-height:100px; }

        /* CTA */
        .nx-cta-banner {
          padding:100px 6%; text-align:center; position:relative; overflow:hidden;
          background:${dark
            ? 'linear-gradient(135deg,#050d1a 0%,#0a1628 100%)'
            : 'linear-gradient(135deg,#0d1b2e 0%,#1e3050 100%)'};
        }
        .nx-cta-banner::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse at center,rgba(26,107,255,0.15) 0%,transparent 70%);
        }
        .nx-cta-banner h2 {
          font-size:clamp(28px,4vw,54px); font-weight:700;
          letter-spacing:-1.5px; margin-bottom:1rem; color:#fff; position:relative;
        }
        .nx-cta-banner h2 span {
          background:linear-gradient(90deg,#4d8dff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-cta-banner p {
          font-size:16px; color:rgba(255,255,255,0.65);
          max-width:480px; margin:0 auto 2.25rem; line-height:1.75; position:relative;
        }
        .nx-btn-white {
          background:#fff; color:#1a6bff; padding:14px 32px;
          border-radius:10px; font-size:15px; font-weight:700;
          border:none; display:inline-flex; align-items:center; gap:8px;
          cursor:pointer; font-family:'Sora',sans-serif;
          transition:all .25s; position:relative;
          box-shadow:0 4px 20px rgba(255,255,255,0.15);
        }
        .nx-btn-white:hover {
          background:#e8f0fe; transform:translateY(-3px);
          box-shadow:0 8px 30px rgba(255,255,255,0.25);
        }

        /* FOOTER */
        .nx-footer {
          background:${dark ? '#050d1a' : '#0d1b2e'};
          padding:2.5rem 6%; display:flex; justify-content:space-between;
          align-items:center; flex-wrap:wrap; gap:1rem;
        }
        .nx-footer-logo { font-size:18px; font-weight:700; color:#fff; }
        .nx-footer-logo span {
          background:linear-gradient(90deg,#4d8dff,#00d4ff);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .nx-footer-copy { font-size:13px; color:rgba(255,255,255,0.45); }
        .nx-footer-links { display:flex; gap:1.5rem; }
        .nx-footer-links a {
          font-size:13px; color:rgba(255,255,255,0.45);
          text-decoration:none; cursor:pointer; transition:color .2s;
        }
        .nx-footer-links a:hover { color:#fff; }

        /* PARALLAX */
        .nx-parallax-slow { will-change:transform; }

        /* RESPONSIVE */
        @media(max-width:1024px){
          .nx-sectors-grid { grid-template-columns:repeat(4,1fr); }
          .nx-services-grid { grid-template-columns:repeat(2,1fr); }
          .nx-why-grid { grid-template-columns:repeat(2,1fr); }
          .nx-sectors-intro { grid-template-columns:1fr; gap:1rem; }
          .nx-contact-wrap { grid-template-columns:1fr; gap:2rem; }
        }
        @media(max-width:768px){
          .nx-nav { padding:0 5%; }
          .nx-nav-links { display:none; }
          .nx-burger { display:flex; }
          .nx-hero { padding:110px 5% 80px; }
          .nx-section { padding:70px 5%; }
          .nx-sectors-grid { grid-template-columns:repeat(3,1fr); gap:10px; }
          .nx-services-grid { grid-template-columns:1fr; }
          .nx-why-grid { grid-template-columns:1fr; }
          .nx-process-steps { grid-template-columns:repeat(2,1fr); gap:2rem; }
          .nx-process-steps::before { display:none; }
          .nx-form-row { grid-template-columns:1fr; }
          .nx-footer { flex-direction:column; text-align:center; }
          .nx-hero-trust { gap:1.25rem; }
        }
        @media(max-width:480px){
          .nx-hero h1 { font-size:32px; }
          .nx-sectors-grid { grid-template-columns:repeat(2,1fr); }
          .nx-process-steps { grid-template-columns:1fr; }
          .nx-hero-actions { flex-direction:column; }
        }
      `}</style>

      <div style={{background:v.white, color:v.text, fontFamily:'Sora,sans-serif', minHeight:'100vh'}}>

        {/* NAV */}
        <nav className="nx-nav">
          <div className="nx-logo">Nexo<span>Labs</span></div>
          <ul className="nx-nav-links">
            {['secteurs','services','process'].map(id=>(
              <li key={id}><a onClick={()=>scrollTo(id)}>{id.charAt(0).toUpperCase()+id.slice(1)}</a></li>
            ))}
            <li>
              <button className="nx-toggle-btn" onClick={()=>setDark(!dark)}>
                {dark ? '☀️ Clair' : '🌙 Sombre'}
              </button>
            </li>
            <li><a className="nx-nav-cta" onClick={()=>scrollTo('contact')}>Nous contacter</a></li>
          </ul>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <button className="nx-toggle-btn" onClick={()=>setDark(!dark)} style={{padding:'7px 10px'}}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button className="nx-burger" onClick={()=>setMenuOpen(!menuOpen)}>
              <span/><span/><span/>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className="nx-mobile-menu">
          <a onClick={()=>scrollTo('secteurs')}>Secteurs</a>
          <a onClick={()=>scrollTo('services')}>Services</a>
          <a onClick={()=>scrollTo('process')}>Processus</a>
          <a onClick={()=>scrollTo('contact')}>Nous contacter →</a>
        </div>

        {/* HERO — parallax on orbs */}
        <section className="nx-hero" ref={heroRef}>
          <div className="nx-hero-orb1" style={{transform:`translateY(${scrollY * 0.15}px)`}}/>
          <div className="nx-hero-orb2" style={{transform:`translateY(${scrollY * -0.1}px)`}}/>

          <div data-id="hero-badge" {...fadeUp('hero-badge')} style={{...fadeUp('hero-badge'), position:'relative'}}>
            <div className="nx-hero-badge">
              <div className="nx-badge-dot"/>
              Agence web · Casablanca, Maroc
            </div>
          </div>

          <div style={{position:'relative', transform:`translateY(${scrollY * 0.05}px)`}}>
            <h1>
              Votre présence digitale,<br/>
              <span className="grad">conçue pour convertir.</span>
            </h1>
            <p className="nx-hero-sub">
              NexoLabs crée des sites web professionnels pour les entreprises
              et professionnels marocains — dans tous les secteurs d'activité.
            </p>
            <div className="nx-hero-actions">
              <button className="nx-btn-primary" onClick={()=>scrollTo('contact')}>Démarrer un projet →</button>
              <button className="nx-btn-outline" onClick={()=>scrollTo('services')}>Voir nos services</button>
            </div>
          </div>

          <div className="nx-hero-trust" style={{position:'relative'}}>
            {[['⚡','Livraison rapide'],['📱','100% responsive'],['🛡️','Devis gratuit'],['🔧','Support inclus']].map(([i,l])=>(
              <div key={l} className="nx-trust-item">
                <div className="nx-trust-icon">{i}</div>{l}
              </div>
            ))}
          </div>
        </section>

        {/* SECTEURS */}
        <section id="secteurs" className="nx-section nx-bg-alt">
          <div className="nx-section-label">Nos secteurs</div>
          <div className="nx-sectors-intro">
            <div>
              <h2 className="nx-section-title">
                Nous travaillons avec <span className="grad">tous les secteurs</span>
              </h2>
              <p className="nx-section-sub" style={{marginBottom:0}}>
                Peu importe votre domaine d'activité — NexoLabs a la solution digitale adaptée.
              </p>
            </div>
            <div>
              <p style={{fontSize:'15px',color:v.text2,lineHeight:1.8}}>
                Restaurants, cliniques, agences immobilières, boutiques, salons de beauté,
                garages, écoles, pharmacies — nous avons déjà travaillé avec des entreprises
                de tous horizons et nous nous adaptons à chaque secteur.
              </p>
            </div>
          </div>
          <div className="nx-sectors-grid" data-id="sectors" style={fadeUp('sectors')}>
            {[['🚗','Location de voitures'],['🍽️','Restaurants & cafés'],['💇','Coiffeurs & beauté'],
              ['🏠','Immobilier'],['🏥','Santé & médecine'],['🛍️','Boutiques & e-commerce'],
              ['🎓','Éducation & formation'],['💼','Services B2B'],['🏋️','Sport & bien-être'],
              ['⚖️','Juridique & conseil'],['🔧','Artisans & services'],['✨','Et bien plus encore…'],
            ].map(([icon,name])=>(
              <div key={name} className="nx-sector-card nx-3d">
                <span className="nx-sector-icon">{icon}</span>
                <div className="nx-sector-name">{name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="nx-section nx-bg-white">
          <div className="nx-section-label">Ce qu'on fait</div>
          <h2 className="nx-section-title">Nos <span className="grad">services</span></h2>
          <p className="nx-section-sub">De la conception à la mise en ligne — NexoLabs gère tout de A à Z.</p>
          <div className="nx-services-grid" data-id="services" style={fadeUp('services')}>
            {[
              {i:'🌐',n:'Site Vitrine',d:'Une présence web professionnelle pour présenter votre activité, vos services et vos coordonnées.',f:['5 à 10 pages','Design responsive (mobile, tablette, PC)','Formulaire de contact','Optimisation SEO de base','Hébergement & nom de domaine']},
              {i:'🛒',n:'E-commerce',d:'Une boutique en ligne complète pour vendre vos produits 24h/24 à vos clients.',f:['Catalogue produits illimité','Panier & processus de commande','Paiement en ligne sécurisé','Gestion des stocks','Dashboard admin complet']},
              {i:'📅',n:'Réservation en ligne',d:'Un système de prise de rendez-vous ou réservation en ligne — disponible 24h/24.',f:['Agenda et gestion des créneaux','Confirmations automatiques','Rappels par email ou SMS','Panel d\'administration','Historique des réservations']},
              {i:'⚙️',n:'Application sur mesure',d:'Des solutions web avancées — plateforme, SaaS, dashboard métier.',f:['Analyse des besoins & cahier des charges','Développement Laravel + React','API REST & intégrations','Formation utilisateur incluse','Maintenance et évolutions']},
              {i:'🔍',n:'SEO & Visibilité',d:'Apparaître en premier sur Google quand vos clients cherchent vos services.',f:['Audit SEO complet','Optimisation des pages','Google My Business','Rapport de positionnement','Suivi mensuel disponible']},
              {i:'🔧',n:'Maintenance & Support',d:'Votre site reste toujours à jour, sécurisé et performant.',f:['Mises à jour régulières','Sauvegardes automatiques','Support technique réactif','Modifications mineures incluses','Rapport mensuel de performance']},
            ].map(srv=>(
              <div key={srv.n} className="nx-service-card nx-grad-border">
                <div className="nx-service-icon-wrap">{srv.i}</div>
                <div className="nx-service-name">{srv.n}</div>
                <div className="nx-service-desc">{srv.d}</div>
                <ul className="nx-service-features">
                  {srv.f.map(f=><li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="nx-section nx-bg-alt">
          <div className="nx-section-label">Comment ça marche</div>
          <h2 className="nx-section-title">Un processus <span className="grad">simple & transparent</span></h2>
          <p className="nx-section-sub">De votre premier message à la mise en ligne — on vous accompagne à chaque étape.</p>
          <div className="nx-process-steps" data-id="process" style={fadeUp('process')}>
            {[['01','Discussion','On écoute vos besoins, on analyse votre secteur et on vous propose la meilleure solution.'],
              ['02','Devis gratuit','Un devis clair et détaillé — fonctionnalités, délais et tarif — sans engagement.'],
              ['03','Développement','On développe votre site et vous montrons l\'avancement. Vous validez chaque étape.'],
              ['04','Livraison','Mise en ligne, formation et suivi post-livraison. Vous êtes entre de bonnes mains.'],
            ].map(([num,title,desc])=>(
              <div key={num} className="nx-process-step">
                <div className="nx-step-number">{num}</div>
                <div className="nx-step-title">{title}</div>
                <div className="nx-step-desc">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY */}
        <section className="nx-section nx-bg-white">
          <div className="nx-section-label">Pourquoi NexoLabs</div>
          <h2 className="nx-section-title">Ce qui nous <span className="grad">différencie</span></h2>
          <p className="nx-section-sub">Nous ne faisons pas que des sites — nous construisons des outils qui font grandir votre business.</p>
          <div className="nx-why-grid" data-id="why" style={fadeUp('why')}>
            {[['🎯','Solutions adaptées à chaque métier','Chaque site est pensé pour votre secteur — pas un template générique, une vraie solution sur mesure.'],
              ['📱','100% responsive & moderne','Tous nos sites sont parfaitement optimisés pour mobile, tablette et ordinateur.'],
              ['⚡','Livraison rapide & garantie','On respecte les délais. Vous savez exactement quand votre site sera en ligne.'],
              ['🤝','Accompagnement complet','De la conception à la mise en ligne et après. On reste disponibles pour vous.'],
              ['🔒','Transparence totale','Devis détaillé, contrat clair, aucune surprise. Vous savez exactement ce que vous payez.'],
              ['🌍','Ancrage local, vision globale','Basés à Casablanca, on connaît le marché marocain et les vrais besoins des PME locales.'],
            ].map(([icon,title,desc])=>(
              <div key={title} className="nx-why-card nx-3d">
                <div className="nx-why-icon">{icon}</div>
                <div className="nx-why-title">{title}</div>
                <div className="nx-why-desc">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="nx-section nx-bg-alt">
          <div className="nx-section-label">Contact</div>
          <h2 className="nx-section-title">Démarrons votre <span className="grad">projet</span></h2>
          <p className="nx-section-sub">Décrivez votre projet — on vous répond sous 24h avec un devis gratuit et sans engagement.</p>
          <div className="nx-contact-wrap" data-id="contact" style={fadeUp('contact')}>
            <div>
              <div className="nx-contact-info-title">On est là pour vous</div>
              <div className="nx-contact-info-desc">
                Que vous ayez une idée précise ou que vous cherchiez encore la meilleure solution
                — contactez-nous. On vous conseille gratuitement.
              </div>
              {[['📍','Casablanca, Maroc'],['📱','+212 770566337'],
  ['✉️','nexolabs26@gmail.com'],['⏱️','Réponse garantie sous 24h']].map(([icon,text])=>(
                <div key={text} className="nx-contact-item">
                  <div className="nx-contact-item-icon">{icon}</div>{text}
                </div>
              ))}
              <div className="nx-contact-note">
                <div className="nx-contact-note-label">Devis gratuit</div>
                <div className="nx-contact-note-text">Contactez-nous pour connaître nos tarifs</div>
                <div className="nx-contact-note-sub">Chaque projet est unique — on vous propose un prix adapté.</div>
              </div>
            </div>

            <form className="nx-contact-form" onSubmit={handleSubmit}>
              <div className="nx-form-row">
                <div className="nx-form-group">
                  <label className="nx-form-label">Prénom</label>
                  <input className="nx-form-input" name="prenom" value={form.prenom}
                    onChange={handleChange} required placeholder="Mohammed"/>
                </div>
                <div className="nx-form-group">
                  <label className="nx-form-label">Nom</label>
                  <input className="nx-form-input" name="nom" value={form.nom}
                    onChange={handleChange} required placeholder="Alami"/>
                </div>
              </div>
              <div className="nx-form-group">
                <label className="nx-form-label">Email ou WhatsApp</label>
                <input className="nx-form-input" name="contact" value={form.contact}
                  onChange={handleChange} required placeholder="contact@monentreprise.ma"/>
              </div>
              <div className="nx-form-group">
                <label className="nx-form-label">Votre secteur d'activité</label>
                <select className="nx-form-select" name="secteur" value={form.secteur} onChange={handleChange}>
                  <option value="">Choisir votre secteur...</option>
                  <option>🚗 Location de voitures</option>
                  <option>🍽️ Restaurant / Café</option>
                  <option>💇 Salon de coiffure / Beauté</option>
                  <option>🏠 Immobilier</option>
                  <option>🏥 Santé & médecine</option>
                  <option>🛍️ Boutique / Commerce</option>
                  <option>🎓 Éducation & formation</option>
                  <option>💼 Services B2B</option>
                  <option>Autre secteur</option>
                </select>
              </div>
              <div className="nx-form-group">
                <label className="nx-form-label">Service souhaité</label>
                <select className="nx-form-select" name="service" value={form.service} onChange={handleChange}>
                  <option value="">Choisir un service...</option>
                  <option>Site vitrine</option>
                  <option>E-commerce</option>
                  <option>Système de réservation</option>
                  <option>Application sur mesure</option>
                  <option>SEO & visibilité</option>
                  <option>Je ne sais pas encore</option>
                </select>
              </div>
              <div className="nx-form-group">
                <label className="nx-form-label">Décrivez votre projet</label>
                <textarea className="nx-form-textarea" name="message" value={form.message}
                  onChange={handleChange}
                  placeholder="Parlez-nous de votre activité, vos objectifs et toute information utile..."/>
              </div>
              {status==='success' && (
                <div style={{background:'#e8f5e9',color:'#2e7d32',padding:'12px',borderRadius:'8px',fontSize:'14px',fontWeight:'500'}}>
                  ✅ Demande envoyée ! On vous répond sous 24h.
                </div>
              )}
              {status==='error' && (
                <div style={{background:'#fdecea',color:'#c62828',padding:'12px',borderRadius:'8px',fontSize:'14px'}}>
                  ❌ Une erreur s'est produite. Réessayez.
                </div>
              )}
              <button className="nx-btn-primary" type="submit"
                disabled={status==='loading'}
                style={{width:'100%',justifyContent:'center'}}>
                {status==='loading' ? 'Envoi en cours...' : 'Envoyer ma demande →'}
              </button>
            </form>
          </div>
        </section>

        {/* CTA */}
        <div className="nx-cta-banner">
          <h2>Votre site web, <span>livré rapidement.</span></h2>
          <p>Rejoignez les professionnels marocains qui ont confié leur présence digitale à NexoLabs.</p>
          <button className="nx-btn-white" onClick={()=>scrollTo('contact')}>
            Demander un devis gratuit →
          </button>
        </div>

        {/* FOOTER */}
        <footer className="nx-footer">
          <div className="nx-footer-logo">Nexo<span>Labs</span></div>
          <div className="nx-footer-copy">© 2026 NexoLabs · Casablanca, Maroc</div>
          <div className="nx-footer-links">
            {['secteurs','services','process','contact'].map(id=>(
              <a key={id} onClick={()=>scrollTo(id)}>
                {id.charAt(0).toUpperCase()+id.slice(1)}
              </a>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}

const L = {
  white:'#ffffff', bg:'#f5f8ff', bg2:'#eef3ff',
  dark:'#0d1b2e', dark2:'#1e3050',
  text:'#0d1b2e', text2:'#4a5c7a', border:'#d4e0ff',
};
const D = {
  white:'#0d1b2e', bg:'#0a1223', bg2:'#0f1e38',
  dark:'#e8f0ff', dark2:'#1e3050',
  text:'#e8f0ff', text2:'#8899bb', border:'rgba(100,150,255,0.15)',
};