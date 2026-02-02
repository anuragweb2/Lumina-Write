/**
 * Central Configuration
 * 
 * Manages environment variables and application-wide settings.
 * This ensures that keys and settings are not hardcoded and can be
 * easily swapped between environments (Local/Dev/Prod).
 */

interface Config {
  apiKey: string;
  environment: string;
  isDevelopment: boolean;
  version: string;
  maxInputLength: number;
}

const isDev = process.env.NODE_ENV !== 'production';

export const config: Config = {
  // securely accessed via process.env as per guidelines
  apiKey: process.env.API_KEY || '',
  
  // Environment detection
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: isDev,
  
  // App Settings
  version: '1.3.0',
  maxInputLength: 1000,
};

// basic validation to aid local development
if (!config.apiKey && config.isDevelopment) {
  console.warn("⚠️ App Configuration Warning: API_KEY is missing. The app may not function correctly.");
}
