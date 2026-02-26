import { create } from 'zustand'

const DEFAULT_OPTIONS = {
  mode: 'model',
  modelType: 'female',
  ethnicity: 'any',
  environment: 'studio-white',
  garmentType: 'top',
  productStyle: 'ghost-mannequin',
  brandStyle: 'generic',
  fabric: 'any',
  fit: 'regular',
  size: 'm',
  targetMarket: 'global',
  generateVideo: false,
}

export const useGenerationStore = create((set) => ({
  // Upload state
  images: [], // Array of { file, preview, base64 }

  // Customization options
  options: { ...DEFAULT_OPTIONS },

  // Generation state
  status: 'idle', // idle | generating | complete | error
  progress: 0,
  progressMessage: '',
  results: [], // Array of base64 image strings
  videoResult: null,
  receipt: null,
  error: null,
  abortController: null,

  // Actions
  addImage: (imageData) =>
    set((state) => ({
      images: state.images.length < 4 ? [...state.images, imageData] : state.images,
    })),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),

  clearImages: () => set({ images: [] }),

  setOption: (key, value) =>
    set((state) => ({
      options: { ...state.options, [key]: value },
    })),

  setStatus: (status) => set({ status }),
  setProgress: (progress, progressMessage) => set({ progress, ...(progressMessage ? { progressMessage } : {}) }),
  setResults: (results) => set({ results, status: 'complete' }),
  setVideoResult: (videoResult) => set({ videoResult }),
  setReceipt: (receipt) => set({ receipt }),
  setError: (error) => set({ error, status: 'error' }),
  setAbortController: (abortController) => set({ abortController }),
  abortGeneration: () => set((state) => {
    state.abortController?.abort()
    return { abortController: null }
  }),

  reset: () =>
    set({
      images: [],
      options: { ...DEFAULT_OPTIONS },
      status: 'idle',
      progress: 0,
      progressMessage: '',
      results: [],
      videoResult: null,
      receipt: null,
      error: null,
      abortController: null,
    }),

  resetResults: () =>
    set({
      status: 'idle',
      progress: 0,
      progressMessage: '',
      results: [],
      videoResult: null,
      receipt: null,
      error: null,
      abortController: null,
    }),
}))
