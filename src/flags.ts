/**
 * Feature flags — wrap incomplete features behind these booleans.
 * Set to `true` only when the feature is production-ready.
 */
const FLAGS = {
  /** Brique 4 — Library / shelf */
  LIBRARY: true,
  /** Brique 4d — Cover images via IndexedDB + ObjectURL */
  COVER_IMAGES: true,
  /** Brique 4.5 — MangaInspector side panel */
  INSPECTOR: false,
  /** Brique 5 — Reader */
  READER: false,
  /** Brique 5e — Page curl animation */
  PAGE_CURL: false,
  /** Brique 5g — Sound effects */
  SOUND: false,
  /** Brique 6 — Add / edit forms */
  FORMS: false,
  /** Brique 7b — Migration from old app */
  MIGRATION: false,
} as const

export default FLAGS
