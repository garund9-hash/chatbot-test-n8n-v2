import { useRef, useEffect } from 'react';

/**
 * useScrollToBottom
 * Custom Hook: encapsulates scroll-to-bottom behavior.
 *
 * Usage:
 *   const messagesEndRef = useScrollToBottom([messages]);
 *   return (
 *     <div className="messages">
 *       ...
 *       <div ref={messagesEndRef} />
 *     </div>
 *   );
 *
 * Returns a ref to attach to a sentinel element at the bottom of the list.
 * When the dependency array changes (e.g., [messages]), scrolls smoothly to that sentinel.
 */

export function useScrollToBottom(dependencies = []) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, dependencies);

  return ref;
}
