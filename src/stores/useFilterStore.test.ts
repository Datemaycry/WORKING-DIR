import { beforeEach, describe, expect, it } from 'vitest'
import { useFilterStore } from './useFilterStore'

beforeEach(() => {
  useFilterStore.setState({ searchQuery: '', activeAuthors: [], activeSeries: [], activeTags: [] })
})

describe('useFilterStore', () => {
  it('setSearchQuery', () => {
    useFilterStore.getState().setSearchQuery('naruto')
    expect(useFilterStore.getState().searchQuery).toBe('naruto')
  })

  it('toggleAuthor adds then removes', () => {
    useFilterStore.getState().toggleAuthor('Oda')
    expect(useFilterStore.getState().activeAuthors).toContain('Oda')
    useFilterStore.getState().toggleAuthor('Oda')
    expect(useFilterStore.getState().activeAuthors).not.toContain('Oda')
  })

  it('toggleTag adds then removes', () => {
    useFilterStore.getState().toggleTag('action')
    expect(useFilterStore.getState().activeTags).toContain('action')
    useFilterStore.getState().toggleTag('action')
    expect(useFilterStore.getState().activeTags).not.toContain('action')
  })

  it('clearFilters resets everything', () => {
    useFilterStore.getState().setSearchQuery('one piece')
    useFilterStore.getState().toggleAuthor('Oda')
    useFilterStore.getState().toggleTag('adventure')
    useFilterStore.getState().clearFilters()
    const s = useFilterStore.getState()
    expect(s.searchQuery).toBe('')
    expect(s.activeAuthors).toHaveLength(0)
    expect(s.activeTags).toHaveLength(0)
  })
})
