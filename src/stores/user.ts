import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/interfaces/user';

interface UserState {
  user: User;
  setUser: (loggedInUser: Partial<User>) => void;
}

export const userStore = create(
  persist<UserState>(
    (set) => ({
      user: {
        id: 0,
        fullname: "",
        image: "",
        username: "",
        email: "",
        date: "",
        token: "",
      },
      setUser: (loggedInUser) => set((state) => ({
        user: { ...state.user, ...loggedInUser }
      })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);