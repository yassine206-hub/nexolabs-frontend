import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/admin/login', form);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Nexo<span style={{color:'#1a6bff'}}>Labs</span></div>
        <h2 style={s.title}>Espace Admin</h2>
        <p style={s.sub}>Connectez-vous pour accéder au dashboard</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <input type="email" placeholder="Email" required
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={s.input} />
          <input type="password" placeholder="Mot de passe" required
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={s.input} />
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.btn}>Se connecter →</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center',
            justifyContent:'center', background:'#f5f8ff',
            fontFamily:'Sora, sans-serif' },
  card:  { background:'#fff', border:'1px solid #d4e0ff', borderRadius:'16px',
            padding:'2.5rem', width:'100%', maxWidth:'380px',
            boxShadow:'0 4px 24px rgba(26,107,255,0.08)' },
  logo:  { fontSize:'22px', fontWeight:'700', marginBottom:'1.25rem', color:'#0d1b2e' },
  title: { fontSize:'20px', fontWeight:'700', color:'#0d1b2e', marginBottom:'.25rem' },
  sub:   { fontSize:'13px', color:'#4a5c7a', marginBottom:'1.5rem' },
  input: { padding:'10px 14px', border:'1.5px solid #d4e0ff', borderRadius:'8px',
            fontSize:'14px', fontFamily:'Sora, sans-serif', outline:'none' },
  btn:   { background:'#1a6bff', color:'#fff', padding:'12px', borderRadius:'8px',
            fontSize:'14px', fontWeight:'600', border:'none', cursor:'pointer',
            fontFamily:'Sora, sans-serif' },
  error: { background:'#fdecea', color:'#c62828', padding:'10px',
            borderRadius:'8px', fontSize:'13px' },
};