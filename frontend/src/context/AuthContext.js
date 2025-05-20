// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../components/Interceptor/api-without-redirect';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const setUserWithoutMeEndpoint = (userObj) => {
  setUser(userObj);
  };

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Błąd autoryzacji:', err);
      setUser(null);
    }
  };



  const navigate = useNavigate();
  
  const logout = async () => {
    try {
      const res = await api.post('/auth/logout');
      if (res.status === 200) {
        setUser(null);
        navigate('/login');
      } else {
        console.error('Nie udało się wylogować, status:', res.status);
      }
    } catch (err) {
      console.error('Błąd wylogowania:', err);
    }
  };

  useEffect(() => {
    checkAuth(); // Sprawdź logowanie na starcie
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth, logout, setUserWithoutMeEndpoint }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
