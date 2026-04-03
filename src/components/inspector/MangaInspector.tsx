import { useNavigate } from 'react-router-dom'
import { useMangaStore } from '../../stores/useMangaStore'
import { useUIStore } from '../../stores/useUIStore'
import { useReaderStore } from '../../stores/useReaderStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import { coverURLCache } from '../../hooks/useLRUCache'
import SidePanel from '../layout/SidePanel'
import InspectorHeader from './InspectorHeader'
import InspectorMeta from './InspectorMeta'
import InspectorProgress from './InspectorProgress'
import InspectorActions from './InspectorActions'
import FLAGS from '../../flags'

export default function MangaInspector() {
  const inspectorOpen = useUIStore((s) => s.inspectorOpen)
  const setInspectorOpen = useUIStore((s) => s.setInspectorOpen)
  const openModal = useUIStore((s) => s.openModal)

  const selectedManga = useMangaStore((s) => s.selectedManga)()
  const removeManga = useMangaStore((s) => s.removeManga)
  const selectManga = useMangaStore((s) => s.selectManga)

  const openManga = useReaderStore((s) => s.openManga)
  const handleDBError = useDBErrorHandler()

  const navigate = useNavigate()

  if (!FLAGS.INSPECTOR) return null
  if (!selectedManga) return null

  const coverUrl = coverURLCache.get(selectedManga.id) ?? null

  function handleRead() {
    if (!selectedManga) return
    openManga(selectedManga.id, selectedManga.totalPages, selectedManga.readingProgress.currentPage)
    setInspectorOpen(false)
    navigate(`/reader/${selectedManga.id}`)
  }

  function handleResume() {
    handleRead()
  }

  function handleEdit() {
    openModal('edit-manga')
  }

  function handleDelete() {
    if (!selectedManga) return
    removeManga(selectedManga.id).catch(handleDBError)
    selectManga(null)
    setInspectorOpen(false)
  }

  return (
    <SidePanel
      open={inspectorOpen}
      onClose={() => setInspectorOpen(false)}
      title="Détails"
    >
      <InspectorHeader
        title={selectedManga.title}
        authors={selectedManga.authors}
        coverUrl={coverUrl}
      />
      <InspectorProgress
        progress={selectedManga.readingProgress}
        totalPages={selectedManga.totalPages}
        onResume={handleResume}
      />
      <InspectorMeta
        series={selectedManga.series}
        tags={selectedManga.tags}
        totalPages={selectedManga.totalPages}
        createdAt={selectedManga.createdAt}
      />
      <InspectorActions
        onRead={handleRead}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SidePanel>
  )
}
