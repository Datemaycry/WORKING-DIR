// ── Manga card ────────────────────────────────────────────────
export const CARD_COVER_WIDTH = 96
export const CARD_COVER_HEIGHT = 140
export const CARD_TITLE_HEIGHT = 28
export const CARD_HEIGHT = CARD_COVER_HEIGHT + CARD_TITLE_HEIGHT  // 168
export const CARD_WIDTH = CARD_COVER_WIDTH                         // 96

// ── Shelf layout ──────────────────────────────────────────────
export const SHELF_PLANK_HEIGHT = 14
export const SHELF_ROW_GAP = 16
/** Total row height used by react-window (card + plank + gap) */
export const SHELF_ROW_HEIGHT = CARD_HEIGHT + SHELF_PLANK_HEIGHT + SHELF_ROW_GAP  // 198

export const SHELF_CARDS_GAP = 10
export const SHELF_H_PADDING = 16  // horizontal padding per side (px-4)

// ── Image cache ───────────────────────────────────────────────
/** Max covers kept in the LRU cache */
export const LRU_CAPACITY = 30
