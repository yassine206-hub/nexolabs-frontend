import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter]     = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return; }
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/admin/contacts');
      setContacts(res.data);
    } catch {
      navigate('/admin/login');
    }
  };

  const markRead = async (id) => {
    await api.patch(`/admin/contacts/${id}`);
    setContacts(contacts.map(c => c.id === id ? {...c, is_read: true} : c));
  };

  const logout = async () => {
    await api.post('/admin/logout');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const filtered = filter === 'all' ? contacts
    : filter === 'new'  ? contacts.filter(c => !c.is_read)
    : contacts.filter(c => c.is_read);

  const newCount = contacts.filter(c => !c.is_read).length;

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>Nexo<span style={{color:'#1a6bff'}}>Labs</span>
          <span style={{fontWeight:400,color:'#4a5c7a'}}> · Dashboard</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {newCount > 0 &&
            <div style={s.badge}>{newCount} nouvelle{newCount>1?'s':''}</div>}
          <button onClick={logout} style={s.logoutBtn}>Déconnexion</button>
        </div>
      </div>

      <div style={s.content}>
        {/* STATS */}
        <div style={s.stats}>
          <div style={s.stat}>
            <div style={s.statVal}>{contacts.length}</div>
            <div style={s.statLabel}>Total demandes</div>
          </div>
          <div style={s.stat}>
            <div style={{...s.statVal, color:'#1a6bff'}}>{newCount}</div>
            <div style={s.statLabel}>Non lues</div>
          </div>
          <div style={s.stat}>
            <div style={{...s.statVal, color:'#2e7d32'}}>
              {contacts.length - newCount}
            </div>
            <div style={s.statLabel}>Traitées</div>
          </div>
        </div>

        {/* FILTERS */}
        <div style={s.filters}>
          {['all','new','read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{...s.filterBtn, ...(filter===f ? s.filterActive : {})}}>
              {f==='all' ? 'Toutes' : f==='new' ? 'Non lues' : 'Lues'}
            </button>
          ))}
        </div>

        {/* LISTE */}
        <div style={s.table}>
          {filtered.length === 0 && (
            <div style={{padding:'2rem',textAlign:'center',
              color:'#4a5c7a',fontSize:'14px'}}>
              Aucune demande pour l'instant.
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id}
              style={{...s.row, background: c.is_read ? '#fff' : '#f0f5ff'}}>
              <div>
                <div style={{fontWeight:600,color:'#0d1b2e',fontSize:'14px'}}>
                  {c.prenom} {c.nom}
                </div>
                {!c.is_read &&
                  <span style={s.newTag}>Nouveau</span>}
                {c.message &&
                  <div style={{fontSize:'12px',color:'#4a5c7a',marginTop:'4px'}}>
                    {c.message}
                  </div>}
              </div>
              <div style={{fontSize:'13px',color:'#4a5c7a'}}>{c.contact}</div>
              <div style={{fontSize:'13px',color:'#0d1b2e'}}>{c.secteur || '—'}</div>
              <div style={{fontSize:'13px',color:'#0d1b2e'}}>{c.service || '—'}</div>
              <div style={{fontSize:'12px',color:'#4a5c7a'}}>
                {new Date(c.created_at).toLocaleDateString('fr-MA')}
              </div>
              <div>
                {!c.is_read ? (
                  <button onClick={() => markRead(c.id)} style={s.readBtn}>
                    Marquer lu ✓
                  </button>
                ) : (
                  <span style={{fontSize:'12px',color:'#2e7d32'}}>✓ Traité</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight:'100vh', background:'#f5f8ff',
                fontFamily:'Sora, sans-serif' },
  header:     { background:'#fff', borderBottom:'1px solid #d4e0ff',
                padding:'0 2rem', height:'64px', display:'flex',
                alignItems:'center', justifyContent:'space-between',
                position:'sticky', top:0, zIndex:10 },
  logo:       { fontSize:'18px', fontWeight:'700', color:'#0d1b2e' },
  badge:      { background:'#1a6bff', color:'#fff', borderRadius:'20px',
                padding:'3px 12px', fontSize:'12px', fontWeight:'600' },
  logoutBtn:  { background:'transparent', border:'1px solid #d4e0ff',
                borderRadius:'8px', padding:'7px 16px', fontSize:'13px',
                color:'#4a5c7a', cursor:'pointer', fontFamily:'Sora, sans-serif' },
  content:    { padding:'2rem', maxWidth:'1200px', margin:'0 auto' },
  stats:      { display:'grid', gridTemplateColumns:'repeat(3,1fr)',
                gap:'16px', marginBottom:'1.5rem' },
  stat:       { background:'#fff', border:'1px solid #d4e0ff',
                borderRadius:'12px', padding:'1.25rem 1.5rem' },
  statVal:    { fontSize:'32px', fontWeight:'700', color:'#0d1b2e', lineHeight:1 },
  statLabel:  { fontSize:'12px', color:'#4a5c7a', marginTop:'4px' },
  filters:    { display:'flex', gap:'8px', marginBottom:'1rem' },
  filterBtn:  { padding:'7px 18px', borderRadius:'8px',
                border:'1px solid #d4e0ff', background:'#fff',
                color:'#4a5c7a', fontSize:'13px', cursor:'pointer',
                fontFamily:'Sora, sans-serif', fontWeight:'500' },
  filterActive:{ background:'#1a6bff', color:'#fff', borderColor:'#1a6bff' },
  table:      { background:'#fff', border:'1px solid #d4e0ff',
                borderRadius:'14px', overflow:'hidden' },
  row:        { display:'grid',
                gridTemplateColumns:'2fr 1.5fr 1.5fr 1.5fr 1fr 1fr',
                padding:'14px 1.5rem', borderBottom:'1px solid #eef3ff',
                alignItems:'center', gap:'1rem' },
  newTag:     { background:'#e8f0fe', color:'#1a6bff', fontSize:'10px',
                fontWeight:'600', padding:'1px 7px', borderRadius:'4px' },
  readBtn:    { background:'#e8f0fe', color:'#1a6bff', border:'none',
                borderRadius:'6px', padding:'5px 10px', fontSize:'12px',
                cursor:'pointer', fontWeight:'600',
                fontFamily:'Sora, sans-serif' },
};