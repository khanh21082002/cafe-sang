import { Store } from '@tanstack/store';
import { User } from '../types';
import { login, register } from '../api/authApi';

export interface AuthState {
  user: User | null;
  isInStore: boolean;
}

const initialState: AuthState = {
  user: null,
  isInStore: false,
};

export const authStore = new Store<AuthState>(initialState);

// Actions
export const authActions = {
  async login(email: string, password: string) {
    try {
      const res = await login(email, password);
      const user = res.data?.user;
      if (user) {
        authStore.setState({
          ...authStore.state,
          user,
          isInStore: user.isInStore || false,
        });
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
    } catch (e) {}
    return false;
  },
  async register(email: string, password: string, fullName: string, phone: string) {
    try {
      const res = await register({ email, password, fullName, phone });
      const user = res.data?.user;
      if (user) {
        authStore.setState({
          ...authStore.state,
          user,
          isInStore: false,
        });
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
    } catch (e) {}
    return false;
  },
  logout() {
    authStore.setState({ user: null, isInStore: false });
    localStorage.removeItem('currentUser');
  },
  switchUser(user: User) {
    authStore.setState({
      ...authStore.state,
      user,
      isInStore: user.isInStore || false,
    });
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  updateUserPoints(newPoints: number) {
    const user = authStore.state.user;
    if (user) {
      const updatedUser = { ...user, points: newPoints };
      authStore.setState({
        ...authStore.state,
        user: updatedUser,
      });
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  },
  setInStore(isIn: boolean) {
    authStore.setState({
      ...authStore.state,
      isInStore: isIn,
    });
  },
  loadUserFromStorage() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        authStore.setState({
          ...authStore.state,
          user: userData,
          isInStore: userData.isInStore || false,
        });
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  },
};

// Custom hook for React
import { useSyncExternalStore } from 'react';
export function useAuthStore<T = AuthState>(selector?: (state: AuthState) => T): T {
  return useSyncExternalStore(
    authStore.subscribe,
    () => (selector ? selector(authStore.state) : (authStore.state as any)),
    () => (selector ? selector(authStore.state) : (authStore.state as any))
  );
}
