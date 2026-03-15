import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * useSession
 * Custom Hook: encapsulates session persistence via localStorage.
 *
 * Returns:
 * - sessionId: current session UUID
 * - resetSession: function to generate and store a new session UUID
 *
 * Uses a lazy useState initialiser to read from localStorage synchronously on mount,
 * eliminating the need for a useEffect and preventing a render with an empty sessionId.
 * When resetSession() is called, generates a new UUID and updates localStorage.
 */

const STORAGE_KEY = 'chat_session_id';

export function useSession() {
  const [sessionId, setSessionId] = useState(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) return storedId;
    const newId = uuidv4();
    localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  });

  const resetSession = () => {
    const newId = uuidv4();
    localStorage.setItem(STORAGE_KEY, newId);
    setSessionId(newId);
    return newId;
  };

  return { sessionId, resetSession };
}
