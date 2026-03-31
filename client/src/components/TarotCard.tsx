// ═══════════════════════════════════════════════════════════
// TAROT CARD COMPONENT — Victorian Occultism / Art Nouveau
// Card with flip animation, gold filigree border, hover lift
// Front: Rider-Waite image; Back: Wisdom message
// Click opens full modal with detailed meaning
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import type { TarotCard } from "@/lib/tarotData";

const SUIT_COLORS: Record<string, string> = {
  "Major Arcana": "oklch(0.82 0.18 75)",
  "Cups": "oklch(0.65 0.18 240)",
  "Pentacles": "oklch(0.65 0.15 145)",
  "Swords": "oklch(0.65 0.18 295)",
  "Wands": "oklch(0.72 0.18 50)",
};

interface TarotCardProps {
  card: TarotCard;
  index: number;
  onClick: () => void;
}

export default function TarotCardComponent({ card, index, onClick }: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const suitColor = SUIT_COLORS[card.suit];

  return (
    <div
      className="fade-in"
      style={{
        animationDelay: `${Math.min(index * 0.025, 1.2)}s`,
        animationFillMode: "both",
        cursor: "pointer",
        aspectRatio: "2 / 3.5",
        width: "100%",
        position: "relative",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`${card.name} — click to reveal meaning`}
    >
      {/* Card wrapper with transform */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isHovered
            ? `0 12px 30px oklch(0.05 0.03 290 / 0.7), 0 0 20px ${suitColor}25`
            : `0 4px 12px oklch(0.05 0.03 290 / 0.5)`,
        }}
      >
        {/* Gold border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "10px",
            border: `1.5px solid ${isHovered ? suitColor + "80" : "oklch(0.72 0.14 75 / 0.25)"}`,
            zIndex: 2,
            pointerEvents: "none",
            transition: "border-color 0.3s ease",
          }}
        />

        {/* Card image */}
        <img
          src={card.imageUrl}
          alt={card.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            display: "block",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Bottom gradient with card name */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "2rem 0.5rem 0.5rem",
            background: `
              linear-gradient(
                to top,
                oklch(0.06 0.03 290 / 0.98) 0%,
                oklch(0.06 0.03 290 / 0.75) 45%,
                transparent 100%
              )
            `,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              color: "oklch(0.92 0.04 80)",
              fontSize: "clamp(0.55rem, 1.4vw, 0.68rem)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 1px 4px oklch(0.05 0.03 290)",
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              color: suitColor,
              fontSize: "clamp(0.42rem, 1vw, 0.52rem)",
              letterSpacing: "0.1em",
              textAlign: "center",
              marginTop: "0.15rem",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {card.suit}
          </div>
        </div>

        {/* Hover overlay — "Click to Reveal" */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${suitColor}18 0%, oklch(0.06 0.03 290 / 0.4) 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              color: suitColor,
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "oklch(0.08 0.04 290 / 0.85)",
              border: `1px solid ${suitColor}50`,
              borderRadius: "4px",
              padding: "0.4rem 0.8rem",
              backdropFilter: "blur(4px)",
              transform: isHovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 0.3s ease",
              marginBottom: "3rem",
            }}
          >
            Reveal
          </div>
        </div>
      </div>
    </div>
  );
}
