// ═══════════════════════════════════════════════════════════
// SEARCH BAR — Victorian Occultism / Art Nouveau Theme
// Gold glow on focus, Cinzel placeholder text
// ═══════════════════════════════════════════════════════════

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto mb-6 mt-6">
      {/* Decorative border glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: value
            ? "linear-gradient(135deg, oklch(0.82 0.18 75 / 0.15), oklch(0.45 0.20 295 / 0.15))"
            : "transparent",
          transition: "background 0.3s ease",
        }}
        aria-hidden="true"
      />

      {/* Search icon */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "oklch(0.72 0.14 75)" }}
      >
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the arcane archives…"
        className="search-input w-full"
        style={{
          fontFamily: "var(--font-garamond)",
          fontSize: "1.05rem",
          fontStyle: value ? "normal" : "italic",
          color: "oklch(0.92 0.04 80)",
          background: "oklch(0.14 0.07 290)",
          border: "1px solid oklch(0.35 0.12 295 / 50%)",
          borderRadius: "8px",
          padding: "0.75rem 3rem 0.75rem 3rem",
          width: "100%",
          letterSpacing: "0.02em",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "oklch(0.72 0.14 75 / 0.7)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "oklch(0.35 0.12 295 / 50%)";
        }}
        aria-label="Search tarot cards"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ color: "oklch(0.65 0.08 295)" }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
