import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * useSession
 * Custom Hook: encapsulates session persistence via localStorage.
 *
 * Returns:
 * - sessionId: current session UUID
 * - resetSession: function to generate and store a new session UUID
 *
 * On first render, if no session exists in localStorage, generates a new UUID and stores it.
 * On subsequent renders, retrieves the stored UUID.
 * When resetSession() is called, generates a new UUID and updates localStorage.
 */

const STORAGE_KEY = 'chat_session_id';

export function useSession() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      setSessionId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem(STORAGE_KEY, newId);
      setSessionId(newId);
    }
  }, []);

  const resetSession = () => {
    const newId = uuidv4();
    localStorage.setItem(STORAGE_KEY, newId);
    setSessionId(newId);
    return newId;
  };

  return { sessionId, resetSession };
}
