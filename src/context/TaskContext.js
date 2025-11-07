import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]); // simple array; normalized store could be added
  const [loading, setLoading] = useState(false);

  const localKey = (uid) => `tasks_${uid}`;

  // Load from local storage
  const loadLocal = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const raw = await AsyncStorage.getItem(localKey(uid));
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn('loadLocal tasks failed', e);
    }
  }, []);

  const saveLocal = useCallback(async (uid, items) => {
    if (!uid) return;
    try {
      await AsyncStorage.setItem(localKey(uid), JSON.stringify(items));
    } catch (e) {
      console.warn('saveLocal tasks failed', e);
    }
  }, []);

  // Subscribe to remote tasks for the user and keep local copy in sync
  useEffect(() => {
    if (!user || !user.uid) {
      setTasks([]);
      return;
    }

    let unsubRemote = null;
    const start = async () => {
      setLoading(true);
      await loadLocal(user.uid);

      try {
        const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
        unsubRemote = onSnapshot(q, (snap) => {
          const remote = [];
          snap.forEach((doc) => remote.push({ id: doc.id, ...doc.data() }));
          setTasks(remote);
          saveLocal(user.uid, remote);
          setLoading(false);
        });
      } catch (e) {
        console.warn('subscribe remote tasks failed', e);
        setLoading(false);
      }
    };

    start();

    return () => {
      if (unsubRemote) unsubRemote();
    };
  }, [user, loadLocal, saveLocal]);

  // CRUD operations
  const addTask = async ({ title, description = '', dueDate = null }) => {
    if (!user || !user.uid) throw new Error('Not authenticated');
    // optimistic update: local state first
    const optimistic = {
      id: `tmp_${Date.now()}`,
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      dueDate,
    };
    setTasks((s) => [optimistic, ...s]);
    saveLocal(user.uid, [optimistic, ...tasks]);

    try {
      const ref = await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        title,
        description,
        completed: false,
        createdAt: Date.now(),
        dueDate,
      });
      // remote snapshot listener will replace local copy with correct IDs
      return { ok: true, id: ref.id };
    } catch (e) {
      console.warn('addTask remote failed', e);
      // rollback optimistic
      await loadLocal(user.uid);
      return { ok: false, error: e.message };
    }
  };

  const updateTask = async (id, patch) => {
    if (!user || !user.uid) throw new Error('Not authenticated');
    // optimistic update
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    saveLocal(user.uid, tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    try {
      await setDoc(doc(db, 'users', user.uid, 'tasks', id), patch, { merge: true });
      return { ok: true };
    } catch (e) {
      console.warn('updateTask failed', e);
      await loadLocal(user.uid);
      return { ok: false, error: e.message };
    }
  };

  const deleteTask = async (id) => {
    if (!user || !user.uid) throw new Error('Not authenticated');
    const prev = tasks;
    setTasks((s) => s.filter((t) => t.id !== id));
    saveLocal(user.uid, tasks.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
      return { ok: true };
    } catch (e) {
      console.warn('deleteTask failed', e);
      setTasks(prev);
      saveLocal(user.uid, prev);
      return { ok: false, error: e.message };
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    return updateTask(id, { completed: !task.completed });
  };

  const refresh = async () => {
    if (!user || !user.uid) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const remote = [];
      snap.forEach((d) => remote.push({ id: d.id, ...d.data() }));
      setTasks(remote);
      saveLocal(user.uid, remote);
    } catch (e) {
      console.warn('refresh failed', e);
    }
    setLoading(false);
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleComplete, refresh }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export default TaskContext;
