import Button from '../ui/Button'

interface Props {
  onRead: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function InspectorActions({ onRead, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <Button variant="primary" size="md" onClick={onRead} className="w-full">
        Lire
      </Button>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
          Modifier
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete} className="flex-1">
          Supprimer
        </Button>
      </div>
    </div>
  )
}
