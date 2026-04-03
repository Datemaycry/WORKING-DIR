import { beforeEach, describe, expect, it } from 'vitest'
import { useReaderStore } from './useReaderStore'

beforeEach(() => {
  useReaderStore.setState({ mangaId: null, currentPage: 0, totalPages: 0, viewMode: 'auto' })
})

describe('useReaderStore', () => {
  it('openManga sets state', () => {
    useReaderStore.getState().openManga('m1', 20, 5)
    const s = useReaderStore.getState()
    expect(s.mangaId).toBe('m1')
    expect(s.currentPage).toBe(5)
    expect(s.totalPages).toBe(20)
  })

  it('nextPage increments currentPage', () => {
    useReaderStore.setState({ mangaId: 'm1', totalPages: 10, currentPage: 0 })
    useReaderStore.getState().nextPage()
    expect(useReaderStore.getState().currentPage).toBe(1)
  })

  it('nextPage does not exceed totalPages - 1', () => {
    useReaderStore.setState({ mangaId: 'm1', totalPages: 3, currentPage: 2 })
    useReaderStore.getState().nextPage()
    expect(useReaderStore.getState().currentPage).toBe(2)
  })

  it('prevPage decrements currentPage', () => {
    useReaderStore.setState({ mangaId: 'm1', totalPages: 10, currentPage: 5 })
    useReaderStore.getState().prevPage()
    expect(useReaderStore.getState().currentPage).toBe(4)
  })

  it('prevPage does not go below 0', () => {
    useReaderStore.setState({ mangaId: 'm1', totalPages: 10, currentPage: 0 })
    useReaderStore.getState().prevPage()
    expect(useReaderStore.getState().currentPage).toBe(0)
  })

  it('goToPage clamps to valid range', () => {
    useReaderStore.setState({ mangaId: 'm1', totalPages: 5, currentPage: 0 })
    useReaderStore.getState().goToPage(100)
    expect(useReaderStore.getState().currentPage).toBe(4)
    useReaderStore.getState().goToPage(-5)
    expect(useReaderStore.getState().currentPage).toBe(0)
  })

  it('closeManga resets state', () => {
    useReaderStore.setState({ mangaId: 'm1', currentPage: 3, totalPages: 10 })
    useReaderStore.getState().closeManga()
    expect(useReaderStore.getState().mangaId).toBeNull()
    expect(useReaderStore.getState().currentPage).toBe(0)
  })
})
