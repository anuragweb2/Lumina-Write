import { config } from '../config';

/**
 * Logger Utility
 * 
 * Wraps console methods to prevent sensitive debug info 
 * from appearing in production builds.
 */

export const logger = {
  debug: (...args: any[]) => {
    if (config.isDevelopment) {
      console.debug('[Dev Debug]:', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (config.isDevelopment) {
      console.info('[Dev Info]:', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn('[App Warning]:', ...args);
  },
  
  error: (...args: any[]) => {
    // Errors should generally be logged in all environments for tracking
    console.error('[App Error]:', ...args);
  }
};
