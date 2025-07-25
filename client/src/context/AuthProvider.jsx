import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error('Failed to parse auth from localStorage', err);
      }
    }
    setLoading(false); 
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);

    localStorage.setItem('auth', JSON.stringify({ user, token }));

    // Auto logout on token expiry
    const decoded = jwtDecode(token);
    const expiry = decoded.exp * 1000;
    const timeout = expiry - Date.now();

    if (timeout > 0) {
      setTimeout(() => {
        logout();
        toast('Session expired. Please log in again.', { icon: '⚠️' });
      }, timeout);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
