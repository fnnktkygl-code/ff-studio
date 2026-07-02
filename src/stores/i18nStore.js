import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  const lang = navigator.language || navigator.userLanguage
  return lang.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export const useI18nStore = create(
  persist(
    (set) => ({
      language: getBrowserLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'ff-studio-i18n',
    }
  )
)
