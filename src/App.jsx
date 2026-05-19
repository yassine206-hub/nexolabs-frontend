import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home        from './pages/Home';
import Login       from './pages/admin/Login';
import Dashboard   from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin"       element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}