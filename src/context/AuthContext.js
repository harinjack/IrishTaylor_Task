import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, email: fbUser.email });
        // Optionally store a lightweight token or uid in SecureStore
        try {
          await SecureStore.setItemAsync('user_uid', fbUser.uid);
        } catch (e) {
          console.warn('SecureStore set failed', e);
        }
      } else {
        setUser(null);
        try { await SecureStore.deleteItemAsync('user_uid'); } catch (e) {}
      }
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  const signUp = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setUser({ uid: cred.user.uid, email: cred.user.email });
      return { ok: true };
    } catch (err) {
      console.error('signup error', err);
      return { ok: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser({ uid: cred.user.uid, email: cred.user.email });
      return { ok: true };
    } catch (err) {
      console.error('signin error', err);
      return { ok: false, error: err.message };
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      try { await SecureStore.deleteItemAsync('user_uid'); } catch (e) {}
    } catch (err) {
      console.error('signout error', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
