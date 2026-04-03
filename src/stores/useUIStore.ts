import { create } from 'zustand'

export type ModalId = 'add-manga' | 'edit-manga' | 'delete-confirm' | 'filter' | null

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIStore {
  activeModal: ModalId
  inspectorOpen: boolean
  toasts: Toast[]
  isLoading: boolean

  // Actions
  openModal: (id: ModalId) => void
  closeModal: () => void
  setInspectorOpen: (open: boolean) => void
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  setLoading: (v: boolean) => void
}

let toastCounter = 0

export const useUIStore = create<UIStore>()((set) => ({
  activeModal: null,
  inspectorOpen: false,
  toasts: [],
  isLoading: false,

  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),

  pushToast: (toast) => {
    const id = `toast-${++toastCounter}`
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setLoading: (isLoading) => set({ isLoading }),
}))
