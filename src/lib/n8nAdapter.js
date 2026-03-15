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

/**
 * hasUsableValue(obj, key): boolean
 * Returns true when obj[key] exists and is non-null, non-undefined, non-empty-string.
 * Extracted to eliminate the repeated triple guard on each response key check.
 */
function hasUsableValue(obj, key) {
  return key in obj && obj[key] !== null && obj[key] !== undefined && obj[key] !== '';
}

export function n8nResponseAdapter(data) {
  // Plain string response
  if (typeof data === 'string') {
    return data;
  }

  // Object response — check known keys
  if (typeof data === 'object' && data !== null) {
    // 'output' is the primary key: n8n AI Agent nodes always set this field.
    if (hasUsableValue(data, 'output')) {
      return String(data.output);
    }

    // 'message' is a fallback for older n8n workflow shapes and webhook-only nodes
    // that do not include an 'output' key.
    if (hasUsableValue(data, 'message')) {
      return String(data.message);
    }
  }

  // Unrecognized shape — throw instead of guessing
  throw new UnrecognizedResponseError(data);
}
