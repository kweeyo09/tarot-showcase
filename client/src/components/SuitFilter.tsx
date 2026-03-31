// ═══════════════════════════════════════════════════════════
// SUIT FILTER — Victorian Occultism / Art Nouveau Theme
// Horizontal pill buttons for filtering by suit
// ═══════════════════════════════════════════════════════════

import { SUITS, SUIT_ELEMENTS, type TarotSuit } from "@/lib/tarotData";

const SUIT_ICONS: Record<string, string> = {
  "All": "✦",
  "Major Arcana": "☽",
  "Cups": "🜄",
  "Pentacles": "⊕",
  "Swords": "⚔",
  "Wands": "🜂",
};

const SUIT_ACTIVE_COLORS: Record<string, string> = {
  "All": "oklch(0.72 0.14 75)",
  "Major Arcana": "oklch(0.82 0.18 75)",
  "Cups": "oklch(0.65 0.18 240)",
  "Pentacles": "oklch(0.65 0.15 145)",
  "Swords": "oklch(0.65 0.18 295)",
  "Wands": "oklch(0.72 0.18 50)",
};

interface SuitFilterProps {
  active: TarotSuit | "All";
  onSelect: (suit: TarotSuit | "All") => void;
}

export default function SuitFilter({ active, onSelect }: SuitFilterProps) {
  const options: (TarotSuit | "All")[] = ["All", ...SUITS];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {options.map((suit) => {
        const isActive = active === suit;
        const activeColor = SUIT_ACTIVE_COLORS[suit];

        return (
          <button
            key={suit}
            onClick={() => onSelect(suit)}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.4rem 1rem",
              borderRadius: "4px",
              border: `1px solid ${isActive ? activeColor : "oklch(0.30 0.10 295 / 40%)"}`,
              background: isActive
                ? `${activeColor}20`
                : "oklch(0.14 0.07 290 / 60%)",
              color: isActive ? activeColor : "oklch(0.55 0.08 295)",
              transition: "all 0.25s ease",
              cursor: "pointer",
              boxShadow: isActive
                ? `0 0 12px ${activeColor}30`
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = activeColor;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${activeColor}60`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.08 295)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.30 0.10 295 / 40%)";
              }
            }}
          >
            <span style={{ marginRight: "0.4rem", opacity: 0.8 }}>{SUIT_ICONS[suit]}</span>
            {suit}
          </button>
        );
      })}
    </div>
  );
}
