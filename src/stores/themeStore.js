import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // 'dark' | 'light'
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
        }),
        { name: 'ff-theme' }
    )
)
