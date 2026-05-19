import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);
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
    if (selected?.id === id) setSelected({...selected, is_read: true});
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }

        .dash-header {
          background: #fff; border-bottom: 1px solid #d4e0ff;
          padding: 0 1.5rem; height: 64px;
          display: flex; align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
        }
        .dash-content { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px; margin-bottom: 1.25rem;
        }
        .dash-stat {
          background: #fff; border: 1px solid #d4e0ff;
          border-radius: 12px; padding: 1.25rem 1.5rem;
        }
        .dash-filters { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; }
        .dash-table { background: #fff; border: 1px solid #d4e0ff; border-radius: 14px; overflow: hidden; }

        /* DESKTOP TABLE */
        .table-desktop { display: block; }
        .table-mobile  { display: none; }

        .table-head {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1fr 1fr;
          padding: 10px 1.5rem;
          background: #f5f8ff; font-size: 11px; font-weight: 600;
          color: #4a5c7a; text-transform: uppercase;
          letter-spacing: 1px; border-bottom: 1px solid #d4e0ff;
        }
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1fr 1fr;
          padding: 14px 1.5rem; border-bottom: 1px solid #eef3ff;
          align-items: center; gap: .75rem; cursor: pointer;
          transition: background .15s;
        }
        .table-row:hover { background: #f5f8ff; }
        .table-row:last-child { border-bottom: none; }

        /* MOBILE CARDS */
        .mobile-card {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #eef3ff;
          cursor: pointer; transition: background .15s;
        }
        .mobile-card:hover { background: #f5f8ff; }
        .mobile-card:last-child { border-bottom: none; }
        .mobile-card-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: .5rem;
        }
        .mobile-card-row {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #4a5c7a; margin-top: 4px;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 1rem;
        }
        .modal {
          background: #fff; border-radius: 16px;
          padding: 1.5rem; width: 100%; max-width: 480px;
          max-height: 90vh; overflow-y: auto;
        }
        .modal-title {
          font-size: 18px; font-weight: 700; color: #0d1b2e;
          margin-bottom: 1.25rem;
        }
        .modal-row {
          display: flex; align-items: flex-start; gap: 10px;
          padding: .75rem 0; border-bottom: 1px solid #eef3ff;
          font-size: 14px;
        }
        .modal-row:last-of-type { border-bottom: none; }
        .modal-label {
          font-size: 11px; font-weight: 600; color: #4a5c7a;
          text-transform: uppercase; letter-spacing: 1px;
          min-width: 80px; margin-top: 2px;
        }
        .modal-value { color: #0d1b2e; line-height: 1.6; }

        @media (max-width: 768px) {
          .dash-stats { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .dash-stat { padding: .9rem 1rem; }
          .table-desktop { display: none; }
          .table-mobile  { display: block; }
          .dash-content { padding: 1rem; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
        }
      `}</style>

      {/* HEADER */}
      <div className="dash-header">
        <div style={s.logo}>
          Nexo<span style={{color:'#1a6bff'}}>Labs</span>
          <span style={{fontWeight:400, color:'#4a5c7a', fontSize:'14px'}}> · Dashboard</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          {newCount > 0 && <div style={s.badge}>{newCount} nouvelle{newCount>1?'s':''}</div>}
          <button onClick={logout} style={s.logoutBtn}>Déconnexion</button>
        </div>
      </div>

      <div className="dash-content">

        {/* STATS */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div style={s.statVal}>{contacts.length}</div>
            <div style={s.statLabel}>Total</div>
          </div>
          <div className="dash-stat">
            <div style={{...s.statVal, color:'#1a6bff'}}>{newCount}</div>
            <div style={s.statLabel}>Non lues</div>
          </div>
          <div className="dash-stat">
            <div style={{...s.statVal, color:'#2e7d32'}}>{contacts.length - newCount}</div>
            <div style={s.statLabel}>Traitées</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="dash-filters">
          {['all','new','read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{...s.filterBtn, ...(filter===f ? s.filterActive : {})}}>
              {f==='all' ? 'Toutes' : f==='new' ? 'Non lues' : 'Lues'}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="dash-table">

          {/* DESKTOP */}
          <div className="table-desktop">
            <div className="table-head">
              <span>Client</span>
              <span>Contact</span>
              <span>Secteur</span>
              <span>Service</span>
              <span>Date</span>
              <span>Action</span>
            </div>
            {filtered.length === 0 && (
              <div style={{padding:'2rem', textAlign:'center', color:'#4a5c7a', fontSize:'14px'}}>
                Aucune demande pour l'instant.
              </div>
            )}
            {filtered.map(c => (
              <div key={c.id} className="table-row"
                style={{background: c.is_read ? '#fff' : '#f0f5ff'}}
                onClick={() => setSelected(c)}>
                <div>
                  <div style={{fontWeight:600, color:'#0d1b2e', fontSize:'14px'}}>
                    {c.prenom} {c.nom}
                  </div>
                  {!c.is_read && <span style={s.newTag}>Nouveau</span>}
                </div>
                <div style={{fontSize:'13px', color:'#4a5c7a'}}>{c.contact}</div>
                <div style={{fontSize:'13px', color:'#0d1b2e'}}>{c.secteur || '—'}</div>
                <div style={{fontSize:'13px', color:'#0d1b2e'}}>{c.service || '—'}</div>
                <div style={{fontSize:'12px', color:'#4a5c7a'}}>
                  {new Date(c.created_at).toLocaleDateString('fr-MA')}
                </div>
                <div onClick={e => e.stopPropagation()}>
                  {!c.is_read ? (
                    <button onClick={() => markRead(c.id)} style={s.readBtn}>✓ Lu</button>
                  ) : (
                    <span style={{fontSize:'12px', color:'#2e7d32'}}>✓ Traité</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE CARDS */}
          <div className="table-mobile">
            {filtered.length === 0 && (
              <div style={{padding:'2rem', textAlign:'center', color:'#4a5c7a', fontSize:'14px'}}>
                Aucune demande pour l'instant.
              </div>
            )}
            {filtered.map(c => (
              <div key={c.id} className="mobile-card"
                style={{background: c.is_read ? '#fff' : '#f0f5ff'}}
                onClick={() => setSelected(c)}>
                <div className="mobile-card-top">
                  <div>
                    <div style={{fontWeight:600, color:'#0d1b2e', fontSize:'14px'}}>
                      {c.prenom} {c.nom}
                    </div>
                    {!c.is_read && <span style={s.newTag}>Nouveau</span>}
                  </div>
                  <div style={{fontSize:'11px', color:'#4a5c7a'}}>
                    {new Date(c.created_at).toLocaleDateString('fr-MA')}
                  </div>
                </div>
                <div className="mobile-card-row">📱 {c.contact}</div>
                {c.secteur && <div className="mobile-card-row">🏢 {c.secteur}</div>}
                {c.service && <div className="mobile-card-row">🔧 {c.service}</div>}
                <div style={{marginTop:'10px'}} onClick={e => e.stopPropagation()}>
                  {!c.is_read ? (
                    <button onClick={() => markRead(c.id)} style={s.readBtn}>
                      Marquer comme lu ✓
                    </button>
                  ) : (
                    <span style={{fontSize:'12px', color:'#2e7d32'}}>✓ Traité</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL DÉTAIL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
              <div className="modal-title">Détail de la demande</div>
              <button onClick={() => setSelected(null)}
                style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#4a5c7a'}}>
                ✕
              </button>
            </div>
            <div className="modal-row">
              <span className="modal-label">Client</span>
              <span className="modal-value">{selected.prenom} {selected.nom}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Contact</span>
              <span className="modal-value">{selected.contact}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Secteur</span>
              <span className="modal-value">{selected.secteur || '—'}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Service</span>
              <span className="modal-value">{selected.service || '—'}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Message</span>
              <span className="modal-value">{selected.message || '—'}</span>
            </div>
            <div className="modal-row">
              <span className="modal-label">Date</span>
              <span className="modal-value">
                {new Date(selected.created_at).toLocaleDateString('fr-MA')}
              </span>
            </div>
            <div style={{marginTop:'1.25rem', display:'flex', gap:'10px'}}>
              {!selected.is_read && (
                <button onClick={() => markRead(selected.id)} style={{...s.readBtn, padding:'10px 20px', fontSize:'14px'}}>
                  Marquer comme lu ✓
                </button>
              )}
              <button onClick={() => setSelected(null)}
                style={{...s.logoutBtn, padding:'10px 20px', fontSize:'14px'}}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const s = {
  page:       { minHeight:'100vh', background:'#f5f8ff', fontFamily:'Sora, sans-serif' },
  logo:       { fontSize:'18px', fontWeight:'700', color:'#0d1b2e' },
  badge:      { background:'#1a6bff', color:'#fff', borderRadius:'20px',
                padding:'3px 12px', fontSize:'12px', fontWeight:'600' },
  logoutBtn:  { background:'transparent', border:'1px solid #d4e0ff',
                borderRadius:'8px', padding:'7px 16px', fontSize:'13px',
                color:'#4a5c7a', cursor:'pointer', fontFamily:'Sora, sans-serif' },
  statVal:    { fontSize:'28px', fontWeight:'700', color:'#0d1b2e', lineHeight:1 },
  statLabel:  { fontSize:'12px', color:'#4a5c7a', marginTop:'4px' },
  filterBtn:  { padding:'7px 16px', borderRadius:'8px', border:'1px solid #d4e0ff',
                background:'#fff', color:'#4a5c7a', fontSize:'13px',
                cursor:'pointer', fontFamily:'Sora, sans-serif', fontWeight:'500' },
  filterActive:{ background:'#1a6bff', color:'#fff', borderColor:'#1a6bff' },
  newTag:     { background:'#e8f0fe', color:'#1a6bff', fontSize:'10px',
                fontWeight:'600', padding:'1px 7px', borderRadius:'4px',
                fontFamily:'DM Mono, monospace' },
  readBtn:    { background:'#e8f0fe', color:'#1a6bff', border:'none',
                borderRadius:'6px', padding:'5px 10px', fontSize:'12px',
                cursor:'pointer', fontWeight:'600', fontFamily:'Sora, sans-serif' },
};