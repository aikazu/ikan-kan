/**
 * Logging utility for the game.
 * This provides a consistent way to handle logging throughout the application.
 * In production, logs can be disabled or sent to a monitoring service.
 */

// Set to false to disable all logging
const ENABLE_LOGS = false;

/**
 * Log information messages
 */
export const logInfo = (message: string): void => {
  if (ENABLE_LOGS) {
    // In a real app, this could be redirected to a logging service
    // eslint-disable-next-line no-console
    console.log(message);
  }
};

/**
 * Log error messages
 */
export const logError = (message: string, error?: unknown): void => {
  if (ENABLE_LOGS) {
    // Errors are important enough that we might want to keep them even in production
    // eslint-disable-next-line no-console
    console.error(message, error);
  }
};

/**
 * Log debug messages (only in development)
 */
export const logDebug = (message: string): void => {
  if (ENABLE_LOGS && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug(message);
  }
}; 