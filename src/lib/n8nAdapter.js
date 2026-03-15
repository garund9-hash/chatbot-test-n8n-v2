/**
 * n8nAdapter
 * Normalizes responses from the n8n webhook to a consistent string format.
 * Adapter pattern: converts varied n8n response shapes to internal interface (string).
 *
 * Handles known response shapes:
 * - Plain string: "hello"
 * - Object with 'output' key: { output: "hello" }
 * - Object with 'message' key: { message: "hello" }
 *
 * Throws an error if the response shape is unrecognized (fails fast).
 * This is better than the previous fallback to JSON.stringify, which would render
 * raw JSON in the chat bubble if n8n changed its response shape.
 */

export class UnrecognizedResponseError extends Error {
  constructor(data) {
    super(`Unrecognized n8n response shape: ${JSON.stringify(data)}`);
    this.name = 'UnrecognizedResponseError';
    this.data = data;
  }
}

export function n8nResponseAdapter(data) {
  // Plain string response
  if (typeof data === 'string') {
    return data;
  }

  // Object response — check known keys
  if (typeof data === 'object' && data !== null) {
    // Try 'output' first (common for n8n)
    if ('output' in data && data.output !== null && data.output !== undefined && data.output !== '') {
      return String(data.output);
    }

    // Try 'message' as fallback
    if ('message' in data && data.message !== null && data.message !== undefined && data.message !== '') {
      return String(data.message);
    }
  }

  // Unrecognized shape — throw instead of guessing
  throw new UnrecognizedResponseError(data);
}
