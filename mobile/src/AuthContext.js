import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (await AsyncStorage.getItem('token')) setUser((await api.get('/auth/me')).data.user);
      } catch { await AsyncStorage.removeItem('token'); }
      setBooting(false);
    })();
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
  };
  const login = (email, password) => authenticate('login', { email, password });
  const register = (name, email, password) => authenticate('register', { name, email, password });
  const logout = async () => { await AsyncStorage.removeItem('token'); setUser(null); };

  return <Ctx.Provider value={{ user, booting, login, register, logout }}>{children}</Ctx.Provider>;
}
