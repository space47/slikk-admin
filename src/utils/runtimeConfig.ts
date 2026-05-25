/**
 * Runtime configuration utility
 * Allows dynamic backend URL switching in development without rebuild
 *
 * PRODUCTION SAFETY:
 * - In production builds, runtime overrides are COMPLETELY DISABLED
 * - Production always uses VITE_BACKEND_URI from build-time environment
 * - Query parameters and localStorage are ignored in production
 * - All errors gracefully fall back to environment variable
 * - localStorage access is wrapped in try-catch for privacy mode/disabled storage
 *
 * DEVELOPMENT USAGE:
 * 1. URL Query: ?backend=https://your-api.com
 * 2. LocalStorage: localStorage.setItem('BACKEND_URI', 'https://your-api.com')
 * 3. Developer Console: window.setBackendURI('https://your-api.com')
 * 4. UI Component: DevBackendSwitcher (purple button in bottom-right)
 *
 * SERVICE WORKER NOTE:
 * The service worker (src/service-worker.ts) uses the build-time env variable
 * and cannot be dynamically configured. This is expected and safe.
 */

const CONFIG_KEY = 'BACKEND_URI';
// Properly handle string "false" from .env files (all env vars are strings)
const IS_DEV = import.meta.env.VITE_DEV === true || import.meta.env.VITE_DEV === 'true';

/**
 * Safe localStorage access with fallback
 */
function safeGetLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    if (IS_DEV) {
      console.warn('[Runtime Config] localStorage access failed:', error);
    }
    return null;
  }
}

/**
 * Safe localStorage setter with fallback
 */
function safeSetLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (IS_DEV) {
      console.warn('[Runtime Config] localStorage write failed:', error);
    }
  }
}

/**
 * Get the runtime backend URI with priority:
 * 1. URL query parameter (?backend=...) - DEV ONLY
 * 2. LocalStorage override - DEV ONLY
 * 3. Environment variable fallback (ALWAYS)
 *
 * In production, query params and localStorage are ignored for security.
 */
export function getRuntimeBackendURI(): string {
  // Get default environment backend
  const envBackend = import.meta.env.VITE_BACKEND_URI;

  // In production, always use environment variable only
  if (!IS_DEV) {
    return envBackend;
  }

  // Development mode: allow runtime overrides
  try {
    // Check URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const queryBackend = urlParams.get('backend');

    if (queryBackend) {
      // Save to localStorage for persistence
      safeSetLocalStorage(CONFIG_KEY, queryBackend);
      console.log(`[Runtime Config] Backend URI set from query param: ${queryBackend}`);
      return queryBackend;
    }

    // Check localStorage
    const storedBackend = safeGetLocalStorage(CONFIG_KEY);
    if (storedBackend) {
      console.log(`[Runtime Config] Using stored backend URI: ${storedBackend}`);
      return storedBackend;
    }

    // Fallback to environment variable
    console.log(`[Runtime Config] Using default backend URI: ${envBackend}`);
    return envBackend;
  } catch (error) {
    // If anything fails, always fall back to environment variable
    if (IS_DEV) {
      console.error('[Runtime Config] Error in getRuntimeBackendURI, falling back to env:', error);
    }
    return envBackend;
  }
}

/**
 * Set backend URI at runtime (DEV ONLY)
 */
export function setBackendURI(uri: string): void {
  if (!IS_DEV) {
    console.warn('[Runtime Config] setBackendURI is disabled in production');
    return;
  }

  safeSetLocalStorage(CONFIG_KEY, uri);
  console.log(`[Runtime Config] Backend URI updated to: ${uri}`);
  console.log('[Runtime Config] Reload the page to apply changes');
}

/**
 * Reset to default environment backend (DEV ONLY)
 */
export function resetBackendURI(): void {
  if (!IS_DEV) {
    console.warn('[Runtime Config] resetBackendURI is disabled in production');
    return;
  }

  try {
    localStorage.removeItem(CONFIG_KEY);
    console.log('[Runtime Config] Reset to default backend URI');
    console.log('[Runtime Config] Reload the page to apply changes');
  } catch (error) {
    console.warn('[Runtime Config] Failed to reset backend URI:', error);
  }
}

/**
 * Get current active backend URI info
 */
export function getBackendInfo(): { current: string; default: string; source: string } {
  const envBackend = import.meta.env.VITE_BACKEND_URI;

  if (!IS_DEV) {
    return {
      current: envBackend,
      default: envBackend,
      source: 'environment (production)'
    };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryBackend = urlParams.get('backend');
    const storedBackend = safeGetLocalStorage(CONFIG_KEY);

    let source = 'environment';
    let current = envBackend;

    if (storedBackend) {
      source = 'localStorage';
      current = storedBackend;
    }

    if (queryBackend) {
      source = 'query parameter';
      current = queryBackend;
    }

    return {
      current,
      default: envBackend,
      source
    };
  } catch (error) {
    return {
      current: envBackend,
      default: envBackend,
      source: 'environment (error fallback)'
    };
  }
}

// Expose utilities to window for easy console access in development
if (IS_DEV) {
  (window as any).setBackendURI = setBackendURI;
  (window as any).resetBackendURI = resetBackendURI;
  (window as any).getBackendInfo = getBackendInfo;

  console.log('[Runtime Config] Dev utilities available:');
  console.log('  window.setBackendURI("https://your-api.com")');
  console.log('  window.resetBackendURI()');
  console.log('  window.getBackendInfo()');
}
