import { n8nResponseAdapter } from '../lib/n8nAdapter.js';

/**
 * chatApi
 * Facade pattern: abstracts away HTTP concerns (fetch, headers, URL, error handling).
 *
 * The calling code never sees a raw HTTP response or needs to know about
 * Content-Type headers, response normalization, or the API endpoint.
 * It just calls sendMessage(text, sessionId) and gets back a string or exception.
 *
 * Security: Calls /api/chat (local backend), not the n8n webhook directly.
 * The actual webhook URL is held server-side in the backend, preventing
 * exposure in the client JS bundle.
 *
 * This makes the API layer easily swappable: if we later switch from n8n to
 * OpenAI directly, we change only this file.
 */

const API_ENDPOINT = '/api/chat';

export const chatApi = {
  async sendMessage(text, sessionId) {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg = errorData?.error || `Network response was not ok (${response.status} ${response.statusText})`;
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Normalize the varied n8n response shapes to a plain string.
    return n8nResponseAdapter(data);
  },
};
