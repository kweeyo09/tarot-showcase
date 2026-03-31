// ═══════════════════════════════════════════════════════════
// CARD MODAL — Victorian Occultism / Art Nouveau Theme
// Full-screen overlay with large card flip and detailed meaning
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { TarotCard } from "@/lib/tarotData";
import { tarotCards } from "@/lib/tarotData";

const SUIT_COLORS: Record<string, string> = {
  "Major Arcana": "oklch(0.82 0.18 75)",
  "Cups": "oklch(0.65 0.18 240)",
  "Pentacles": "oklch(0.65 0.15 145)",
  "Swords": "oklch(0.65 0.18 295)",
  "Wands": "oklch(0.72 0.18 50)",
};

interface CardModalProps {
  card: TarotCard;
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(card);
  const currentIndex = tarotCards.findIndex((c) => c.id === currentCard.id);
  const suitColor = SUIT_COLORS[currentCard.suit];

  // Reset flip when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard.id]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentCard(tarotCards[currentIndex - 1]);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < tarotCards.length - 1) {
      setCurrentCard(tarotCards[currentIndex + 1]);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " " || e.key === "f") setIsFlipped((f) => !f);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goToPrev, goToNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${currentCard.name} details`}
    >
      {/* Modal container */}
      <div
        className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto fade-in"
        style={{
          background: "oklch(0.12 0.06 290)",
          border: "1px solid oklch(0.30 0.12 295 / 50%)",
          borderRadius: "16px",
          boxShadow: `
            0 0 40px oklch(0.20 0.10 295 / 0.5),
            0 0 80px oklch(0.15 0.08 295 / 0.3),
            inset 0 1px 0 oklch(0.40 0.15 295 / 0.2)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid oklch(0.25 0.10 295 / 40%)" }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel)",
                color: suitColor,
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "0.2rem",
              }}
            >
              {currentCard.suit}
              {currentCard.element && ` · ${currentCard.element}`}
              {currentCard.zodiac && ` · ${currentCard.zodiac}`}
              {currentCard.planet && ` · ${currentCard.planet}`}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.92 0.04 80)",
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                lineHeight: 1.1,
              }}
            >
              {currentCard.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Card counter */}
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.50 0.08 295)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
              }}
            >
              {currentIndex + 1} / {tarotCards.length}
            </span>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                color: "oklch(0.55 0.08 295)",
                background: "oklch(0.18 0.08 290)",
                border: "1px solid oklch(0.30 0.10 295 / 40%)",
                borderRadius: "6px",
                padding: "0.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.92 0.04 80)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.45 0.15 295 / 60%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.08 295)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.30 0.10 295 / 40%)";
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Left: Card flip */}
          <div className="flex flex-col items-center gap-4 md:w-64 flex-shrink-0">
            {/* Flip container */}
            <div
              className={`card-flip-container ${isFlipped ? "flipped" : ""}`}
              style={{
                width: "200px",
                height: "350px",
                cursor: "pointer",
              }}
              onClick={() => setIsFlipped(!isFlipped)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setIsFlipped(!isFlipped)}
              aria-label={isFlipped ? "Click to see card front" : "Click to see card meaning"}
            >
              <div className="card-flip-inner">
                {/* Front */}
                <div
                  className="card-face"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `2px solid ${suitColor}50`,
                    boxShadow: `0 0 20px ${suitColor}20`,
                  }}
                >
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </div>

                {/* Back */}
                <div
                  className="card-face card-face-back card-back-pattern"
                  style={{
                    borderRadius: "12px",
                    border: `2px solid ${suitColor}50`,
                    boxShadow: `0 0 20px ${suitColor}20`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                    gap: "0.75rem",
                  }}
                >
                  {/* Decorative mandala-like circle */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: `1px solid ${suitColor}60`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        border: `1px solid ${suitColor}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: suitColor,
                          boxShadow: `0 0 12px ${suitColor}`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      color: suitColor,
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    {currentCard.suit}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      color: "oklch(0.92 0.04 80)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {currentCard.name}
                  </div>

                  <div
                    style={{
                      width: "40px",
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${suitColor}80, transparent)`,
                    }}
                  />

                  <div
                    style={{
                      fontFamily: "var(--font-garamond)",
                      color: "oklch(0.80 0.06 295)",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    "{currentCard.wisdomMessage}"
                  </div>
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.55 0.08 295)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "none",
                border: "1px solid oklch(0.25 0.08 295 / 50%)",
                borderRadius: "4px",
                padding: "0.4rem 0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = suitColor;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${suitColor}60`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.08 295)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.25 0.08 295 / 50%)";
              }}
            >
              <RotateCcw size={12} />
              {isFlipped ? "See Card" : "Flip Card"}
            </button>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {currentCard.keywords.map((kw) => (
                <span
                  key={kw}
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: suitColor,
                    background: `${suitColor}12`,
                    border: `1px solid ${suitColor}30`,
                    borderRadius: "3px",
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Card details */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Description */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: suitColor,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                ✦ The Card
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-garamond)",
                  color: "oklch(0.80 0.05 295)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {currentCard.description}
              </p>
            </div>

            {/* Divider */}
            <div className="ornamental-divider">
              <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "oklch(0.72 0.14 75)" }}>✦</span>
            </div>

            {/* Upright Meaning */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: "oklch(0.72 0.14 75)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "oklch(0.72 0.14 75)" }}>↑</span>
                Upright Meaning
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-garamond)",
                  color: "oklch(0.85 0.04 80)",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                }}
              >
                {currentCard.upright}
              </p>
            </div>

            {/* Reversed Meaning */}
            <div
              style={{
                background: "oklch(0.14 0.07 290 / 60%)",
                border: "1px solid oklch(0.25 0.10 295 / 40%)",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: "oklch(0.65 0.18 295)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>↑</span>
                Reversed Meaning
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-garamond)",
                  color: "oklch(0.72 0.06 295)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {currentCard.reversed}
              </p>
            </div>

            {/* Wisdom Message */}
            <div
              style={{
                textAlign: "center",
                padding: "1rem",
                background: `linear-gradient(135deg, ${suitColor}08, ${suitColor}15)`,
                border: `1px solid ${suitColor}30`,
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: suitColor,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Wisdom
              </div>
              <div
                style={{
                  fontFamily: "var(--font-garamond)",
                  color: "oklch(0.90 0.04 80)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}
              >
                "{currentCard.wisdomMessage}"
              </div>
            </div>
          </div>
        </div>

        {/* Navigation footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid oklch(0.25 0.10 295 / 40%)" }}
        >
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            style={{
              fontFamily: "var(--font-cinzel)",
              color: currentIndex === 0 ? "oklch(0.35 0.06 295)" : "oklch(0.65 0.10 295)",
              background: "oklch(0.16 0.07 290)",
              border: "1px solid oklch(0.28 0.10 295 / 40%)",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: currentIndex === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          {/* Card number indicator */}
          <div className="flex gap-1">
            {[...Array(Math.min(5, tarotCards.length))].map((_, i) => {
              const dotIndex = Math.max(0, Math.min(currentIndex - 2, tarotCards.length - 5)) + i;
              return (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: dotIndex === currentIndex ? suitColor : "oklch(0.30 0.08 295)",
                    transition: "background 0.3s ease",
                  }}
                />
              );
            })}
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === tarotCards.length - 1}
            style={{
              fontFamily: "var(--font-cinzel)",
              color: currentIndex === tarotCards.length - 1 ? "oklch(0.35 0.06 295)" : "oklch(0.65 0.10 295)",
              background: "oklch(0.16 0.07 290)",
              border: "1px solid oklch(0.28 0.10 295 / 40%)",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: currentIndex === tarotCards.length - 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: currentIndex === tarotCards.length - 1 ? 0.4 : 1,
            }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
