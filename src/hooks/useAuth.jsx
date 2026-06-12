import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const AUTH_KEY = 'netflix_clone_auth';
const AuthContext = createContext(null);

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const signIn = useCallback((email, password) => {
    // UI-only auth — no real backend
    const fakeUser = {
      email,
      displayName: email.split('@')[0],
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    setUser(fakeUser);
    return fakeUser;
  }, []);

  const signUp = useCallback((email, password) => {
    return signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
