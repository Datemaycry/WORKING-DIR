import { beforeEach, describe, expect, it } from 'vitest'
import { useUIStore } from './useUIStore'

beforeEach(() => {
  useUIStore.setState({ activeModal: null, inspectorOpen: false, toasts: [], isLoading: false })
})

describe('useUIStore', () => {
  it('openModal / closeModal', () => {
    useUIStore.getState().openModal('add-manga')
    expect(useUIStore.getState().activeModal).toBe('add-manga')
    useUIStore.getState().closeModal()
    expect(useUIStore.getState().activeModal).toBeNull()
  })

  it('setInspectorOpen', () => {
    useUIStore.getState().setInspectorOpen(true)
    expect(useUIStore.getState().inspectorOpen).toBe(true)
  })

  it('pushToast adds a toast with unique id', () => {
    useUIStore.getState().pushToast({ message: 'Hello', type: 'success' })
    useUIStore.getState().pushToast({ message: 'World', type: 'error' })
    const { toasts } = useUIStore.getState()
    expect(toasts).toHaveLength(2)
    expect(toasts[0]!.id).not.toBe(toasts[1]!.id)
  })

  it('dismissToast removes by id', () => {
    useUIStore.getState().pushToast({ message: 'Bye', type: 'info' })
    const id = useUIStore.getState().toasts[0]!.id
    useUIStore.getState().dismissToast(id)
    expect(useUIStore.getState().toasts).toHaveLength(0)
  })

  it('setLoading', () => {
    useUIStore.getState().setLoading(true)
    expect(useUIStore.getState().isLoading).toBe(true)
  })
})
