import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, isPro, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isPro,
    isAnonymous: user?.isAnonymous ?? false,
    logout,
  };
}
