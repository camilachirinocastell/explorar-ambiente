// Session state for the admin panel (Zustand).
// Holds only the logged-in user's public data. The token stays in an httpOnly cookie.

import { create } from 'zustand';

import { ApiError } from '../api/client';
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '../api/auth';
import type { AuthUser, LoginValues } from '../api/auth';

// 'checking' is the initial state: we do not know yet whether a session cookie exists,
// so protected routes must wait instead of redirecting to the login page
type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  restoreSession: () => Promise<void>;
  login: (values: LoginValues) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'checking',

  // Runs once when the app loads: a 401 simply means "no session", not an error
  restoreSession: async () => {
    try {
      const user = await fetchCurrentUser();
      set({ user, status: 'authenticated' });
    } catch (error) {
      // Network failures also end up as "no session": the admin just sees the login page
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error('Could not restore the session', error);
      }
      set({ user: null, status: 'unauthenticated' });
    }
  },

  // Errors (wrong credentials, rate limit) are left to the caller to show in the form
  login: async (values) => {
    const user = await loginRequest(values);
    set({ user, status: 'authenticated' });
  },

  // The local session is cleared even if the request fails, so the panel never stays open by mistake
  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      set({ user: null, status: 'unauthenticated' });
    }
  },
}));
