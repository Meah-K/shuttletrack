/**
 * Secure storage for the JWT login token.
 *
 * Uses Expo SecureStore which encrypts the value before saving it on
 * the device. Both the Student App and the Driver App import these
 * functions to save/read/delete the token.
 *
 * Owner: Salma
 *
 * Install once:
 *   npx expo install expo-secure-store
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'shuttletrack.token';
const ROLE_KEY = 'shuttletrack.role';

export type UserRole = 'STUDENT' | 'DRIVER';

/** Save the JWT token and the user role together (call right after login). */
export async function saveSession(token: string, role: UserRole): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(ROLE_KEY, role);
}

/** Read the JWT token, or null if the user is not logged in. */
export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

/** Read the saved role, or null if not logged in. */
export async function getRole(): Promise<UserRole | null> {
  const role = await SecureStore.getItemAsync(ROLE_KEY);
  return role === 'STUDENT' || role === 'DRIVER' ? role : null;
}

/** Wipe the token + role (call on logout). */
export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(ROLE_KEY);
}