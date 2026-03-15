/**
 * commandRegistry
 * Command pattern: centralized registry of slash commands.
 * Each command is a function that receives a context object and performs an action.
 *
 * Allows adding new commands without modifying the dispatch logic.
 * Example: user types '/clear', handler looks up registry['/clear'], executes.
 */

export const commandRegistry = {
  '/clear': (context) => {
    context.clearChat();
  },

  '/help': (context) => {
    context.addSystemMessage('Available commands: /clear, /help, /session');
  },

  '/session': (context) => {
    context.addSystemMessage(`Session ID: ${context.sessionId}`);
  },
};

/**
 * isCommand(input: string): boolean
 * Check if input is a registered command.
 */
export function isCommand(input) {
  const trimmed = input.trim().toLowerCase();
  return trimmed in commandRegistry;
}

/**
 * executeCommand(input: string, context: object): void
 * Look up and execute a command from the registry.
 * Throws if the command is not registered.
 */
export function executeCommand(input, context) {
  const trimmed = input.trim().toLowerCase();
  const command = commandRegistry[trimmed];

  if (!command) {
    throw new Error(`Unknown command: ${input}`);
  }

  command(context);
}
