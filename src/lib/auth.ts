/**
 * Auth state helpers used by both apps.
 *
 * checkLoginState() runs on app launch and tells the navigator
 * whether to send the user to a Login screen, the Student app, or
 * the Driver app.
 *
 * Owner: Salma
 */

import { getToken, getRole, UserRole } from './tokenStorage';

export type AuthRoute = 'LOGIN' | 'STUDENT_HOME' | 'DRIVER_HOME';

export interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  route: AuthRoute;
}

/**
 * Read the saved token + role from secure storage and decide which
 * screen the user should land on when the app launches.
 *
 * Mirabelle calls this from App.tsx after the splash screen.
 */
export async function checkLoginState(): Promise<AuthState> {
  const token = await getToken();
  const role = await getRole();

  if (!token || !role) {
    return { isLoggedIn: false, role: null, route: 'LOGIN' };
  }

  return {
    isLoggedIn: true,
    role,
    route: role === 'DRIVER' ? 'DRIVER_HOME' : 'STUDENT_HOME',
  };
}

/** Quick boolean check — useful in screens that just need yes/no. */
export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}