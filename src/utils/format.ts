export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(timestamp))
}

export function formatProgress(currentPage: number, totalPages: number): string {
  if (totalPages === 0) return '0 %'
  return `${Math.round((currentPage / totalPages) * 100)} %`
}
