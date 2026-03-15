import { useRef, useEffect } from 'react';

/**
 * useScrollToBottom
 * Custom Hook: encapsulates scroll-to-bottom behavior.
 *
 * Usage:
 *   const scrollAnchorRef = useScrollToBottom([messages]);
 *   return (
 *     <div className="messages">
 *       ...
 *       <div ref={scrollAnchorRef} />
 *     </div>
 *   );
 *
 * Returns a ref to attach to a sentinel element at the bottom of the list.
 * When the dependency array changes (e.g., [messages]), scrolls smoothly to that sentinel.
 */

export function useScrollToBottom(dependencies = []) {
  const scrollAnchorRef = useRef(null);

  // The deps array is intentionally dynamic (passed by the caller) rather than
  // statically declared. This is a deliberate design choice: the hook must respond
  // to whatever the caller decides is scroll-triggering state. ESLint exhaustive-deps
  // would flag this, but it is correct for this generic utility hook.
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, dependencies);

  return scrollAnchorRef;
}
