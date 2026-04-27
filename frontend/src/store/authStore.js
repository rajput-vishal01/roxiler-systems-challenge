import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state._hasHydrated = true;
      },
    },
  ),
);

// Expose hydration check outside of React
export const useHydrated = () => useAuthStore.persist.hasHydrated();
