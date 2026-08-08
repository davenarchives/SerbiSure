import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Automatically determines the API Base URL:
 * 1. Checks process.env.EXPO_PUBLIC_API_URL (if defined in .env)
 * 2. Uses http://127.0.0.1:8000 on Android (works via ADB reverse tcp:8000 tcp:8000 over USB)
 * 3. Dynamically extracts the host PC IP address from Expo Metro bundler
 * 4. Falls back to default local network IP
 */
function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Step 1: Try to dynamically grab the real WiFi IP from Expo's Metro bundler.
  // This works on physical phones connected over WiFi — it extracts the PC's IP automatically.
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000`;
    }
  }

  // Step 2: If no real IP was found, we're likely on an Android emulator or USB with ADB reverse.
  // In that case, 127.0.0.1 routes straight to the PC's localhost.
  if (Platform.OS === 'android') {
    return 'http://127.0.0.1:8000';
  }

  // Step 3: Final fallback (e.g. iOS simulator or edge cases)
  return 'http://192.168.1.6:8000';
}

export const API_BASE_URL = getApiBaseUrl();
export const DEFAULT_TIMEOUT_MS = 15000; // 15 seconds

/**
 * Fetch wrapper that adds a default timeout so HTTP calls don't hang indefinitely
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}
