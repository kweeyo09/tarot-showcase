/**
 * CardSpread — Interactive arch card spread
 * Design: Victorian Occultism / Art Nouveau
 *
 * Architecture:
 * - The section is min-height: 100vh so the arch always fills the screen
 * - Heading sits at the TOP of the section (above the arch)
 * - The arch container fills the BOTTOM portion of the section
 * - Cards are positioned using CSS transform (translateX + translateY + rotate)
 *   anchored from the CENTER-BOTTOM of the container — no bottom/left tricks
 * - Mouse X across the container smoothly rolls the arc offset (slow lerp)
 * - All 78 cards are always reachable: arc offset shifts the fan so edge cards
 *   come into the center when the mouse is at the far left/right
 * - Cards are large enough to click comfortably
 * - Click triggers a full-screen flip reveal modal
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tarotCards, type TarotCard } from "@/lib/tarotData";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Card back CDN URL ────────────────────────────────────────────────────────
const CARD_BACK_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663487115720/2i9JDtoxmfdYJFqXPDfh6d/tarot-card-back-hAH3477CYby4mpznTT66Bh.webp";

// ─── Geometry constants ───────────────────────────────────────────────────────
// ARCH GEOMETRY (top-left coordinate system, y increases downward):
//
// The arc circle has its centre ABOVE the container top edge.
// Arc centre is at (containerWidth/2, -ARC_RADIUS) in container coords.
// A card at angle θ (measured from straight-up, i.e. from 12 o'clock):
//   card_centre_x = containerWidth/2 + R*sin(θ)
//   card_centre_y = -R + R*(1-cos(θ))   ... but arc centre is at y=-R
//                 = -R + R - R*cos(θ)
//                 = -R*cos(θ)   ... in container coords (negative = above top)
//
// Wait — arc centre is at y=-R (above container). Card on circle at angle θ:
//   card_y_in_container = arcCentreY + R*cos(θ) = -R + R*cos(θ) = R*(cos(θ)-1)
// This is always ≤ 0 (above container top) which is wrong.
//
// CORRECT APPROACH: Arc centre is BELOW the container bottom.
// Arc centre at y = containerHeight + R  (below container bottom).
// Card at angle θ from straight-up:
//   card_bottom_y = arcCentreY - R*cos(θ) = (containerH + R) - R*cos(θ)
//   card_top_y = card_bottom_y - CARD_H
//
// For centre card (θ=0): card_bottom_y = containerH + R - R = containerH → at container bottom ✓
// For edge card (θ=35°): card_bottom_y = containerH + R - R*cos(35°) = containerH + R*(1-cos35°)
//   This is BELOW container bottom — cards drop down at edges ✓ (arch shape)
//
// Container height should be: CARD_H + HOVER_RISE + padding
// (edge cards extend below container bottom, which is fine with overflow:visible)

const TOTAL_CARDS = tarotCards.length; // 78
const CARD_W = 90;   // px
const CARD_H = 152;  // px — proper tarot card ratio ~1:1.7
const ARC_RADIUS = 750; // px — controls arch curvature
const ARC_SPAN_DEG = 62;  // total degrees of the fan
const HOVER_RISE_PX = 65; // how far the hovered card rises
const ROLL_RANGE_DEG = 25; // max arc offset from mouse
// Container height: just enough for centre card + hover rise + small padding
// Edge cards extend below the container bottom (overflow:visible handles this)
const EDGE_Y_DROP = ARC_RADIUS * (1 - Math.cos((ARC_SPAN_DEG / 2) * Math.PI / 180));
const CONTAINER_H = CARD_H + HOVER_RISE_PX + 20; // ~237px — edge cards overflow below

// ─── Lerp helper ─────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Individual spread card ───────────────────────────────────────────────────
interface SpreadCardProps {
  card: TarotCard;
  index: number;
  total: number;
  arcOffsetDeg: number;
  hoveredIndex: number | null;
  onHover: (i: number | null) => void;
  onClick: (card: TarotCard) => void;
  isDrawn: boolean;
}

function SpreadCard({
  card,
  index,
  total,
  arcOffsetDeg,
  hoveredIndex,
  onHover,
  onClick,
  isDrawn,
}: SpreadCardProps) {
  // Base angle for this card within the fan (0 = centre)
  const baseAngleDeg = -ARC_SPAN_DEG / 2 + (index / (total - 1)) * ARC_SPAN_DEG;
  // Apply the rolling offset driven by mouse position
  const angleDeg = baseAngleDeg + arcOffsetDeg;
  const angleRad = (angleDeg * Math.PI) / 180;

  // ARCH GEOMETRY (arc centre is BELOW the container bottom):
  // Arc centre is at y = CONTAINER_H + ARC_RADIUS (in container top-left coords).
  // Card at angle θ:
  //   card_bottom_y = arcCentreY - R*cos(θ) = (CONTAINER_H + R) - R*cos(θ)
  //   card_top_y = card_bottom_y - CARD_H
  //   card_left = containerWidth/2 + R*sin(θ) - CARD_W/2
  //
  // Centre card (θ=0): card_bottom_y = CONTAINER_H + R - R = CONTAINER_H (at container bottom)
  // Edge cards (θ=±36°): card_bottom_y = CONTAINER_H + R*(1-cos36°) > CONTAINER_H (below container)
  // This creates a proper ARCH shape: centre is highest, edges drop down.
  const x = ARC_RADIUS * Math.sin(angleRad);
  const cardBottomY = CONTAINER_H + ARC_RADIUS - ARC_RADIUS * Math.cos(angleRad);
  const cardTopY = cardBottomY - CARD_H;

  const isHovered = hoveredIndex === index;
  const distFromHover =
    hoveredIndex !== null ? Math.abs(index - hoveredIndex) : Infinity;
  const neighbourRise =
    distFromHover === 1
      ? HOVER_RISE_PX * 0.4
      : distFromHover === 2
      ? HOVER_RISE_PX * 0.15
      : 0;
  const rise = isHovered ? HOVER_RISE_PX : neighbourRise;

  // z-index: centre cards on top; hovered card always on top
  const baseZ = Math.round(60 - Math.abs(baseAngleDeg));

  return (
    <motion.div
      data-spread-card="true"
      className="absolute select-none"
      style={{
        width: CARD_W,
        height: CARD_H,
        // Position the card at its arch location
        top: cardTopY,
        left: `calc(50% + ${x - CARD_W / 2}px)`,
        // Rotate around card bottom-centre to fan the cards
        transformOrigin: "bottom center",
        // Apply rotation statically — only rise is animated
        transform: `rotate(${angleDeg}deg)`,
        zIndex: isHovered ? 300 : baseZ,
        opacity: isDrawn ? 0.2 : 1,
        pointerEvents: isDrawn ? "none" : "auto",
        cursor: isDrawn ? "default" : "pointer",
      }}
      animate={{
        y: -rise,
        scale: isHovered ? 1.12 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 26,
        mass: 0.9,
      }}
      onMouseEnter={() => !isDrawn && onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !isDrawn && onClick(card)}
    >
      {/* Card face (back side shown in spread) */}
      <div
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          boxShadow: isHovered
            ? "0 0 32px 10px rgba(212,175,55,0.65), 0 16px 48px rgba(0,0,0,0.85)"
            : "0 4px 18px rgba(0,0,0,0.6)",
          border: isHovered
            ? "2px solid rgba(212,175,55,0.9)"
            : "1px solid rgba(212,175,55,0.15)",
          transition: "box-shadow 0.18s ease, border 0.18s ease",
        }}
      >
        <img
          src={CARD_BACK_URL}
          alt="Tarot card back"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Hover glow overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.05) 100%)",
          }}
        />
      )}
    </motion.div>
  );
}

// ─── Reveal Modal ─────────────────────────────────────────────────────────────
interface RevealModalProps {
  card: TarotCard;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function RevealModal({ card, onClose, onPrev, onNext }: RevealModalProps) {
  const [flipped, setFlipped] = useState(false);

  // Auto-flip after a short dramatic pause
  useEffect(() => {
    setFlipped(false);
    const t = setTimeout(() => setFlipped(true), 650);
    return () => clearTimeout(t);
  }, [card.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  const suitColors: Record<string, string> = {
    "Major Arcana": "#d4af37",
    Cups: "#7ec8e3",
    Pentacles: "#a8d5a2",
    Swords: "#c8b8e3",
    Wands: "#e3a87e",
  };
  const suitColor = suitColors[card.suit] ?? "#d4af37";

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(4,2,12,0.88)", backdropFilter: "blur(8px)" }}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 max-w-4xl w-full p-6 md:p-10 rounded-2xl overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, rgba(22,10,42,0.99) 0%, rgba(10,4,22,0.99) 100%)",
          border: "1px solid rgba(212,175,55,0.25)",
          boxShadow:
            "0 0 120px rgba(139,92,246,0.15), 0 40px 100px rgba(0,0,0,0.9)",
          maxHeight: "90vh",
        }}
        initial={{ scale: 0.85, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all z-10"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "rgba(212,175,55,0.7)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(212,175,55,0.18)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(212,175,55,1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(212,175,55,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(212,175,55,0.7)";
          }}
        >
          <X size={18} />
        </button>

        {/* ── Card flip ── */}
        <div
          className="flex-shrink-0 mx-auto md:mx-0"
          style={{ width: 200, height: 340, perspective: "1000px", cursor: "pointer" }}
          onClick={() => setFlipped((f) => !f)}
          title="Click to flip"
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Back face */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                border: "2px solid rgba(212,175,55,0.35)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
              }}
            >
              <img
                src={CARD_BACK_URL}
                alt="Card back"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: `2px solid ${suitColor}55`,
                boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 30px ${suitColor}22`,
              }}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Card info ── */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Header */}
          <div>
            <div
              className="text-xs tracking-[0.25em] mb-1"
              style={{
                fontFamily: "Cinzel, serif",
                color: suitColor,
                opacity: 0.7,
              }}
            >
              {card.suit.toUpperCase()}
              {card.number !== undefined ? ` · ${card.number}` : ""}
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "Cinzel Decorative, serif", color: "#f5e6c8" }}
            >
              {card.name}
            </h2>
            {card.keywords && (
              <div className="flex flex-wrap gap-2 mt-2">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "Cinzel, serif",
                      color: suitColor,
                      border: `1px solid ${suitColor}44`,
                      background: `${suitColor}0d`,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {card.description && (
            <p
              className="text-base leading-relaxed"
              style={{
                fontFamily: "EB Garamond, serif",
                color: "rgba(245,230,200,0.82)",
                fontSize: "1.05rem",
              }}
            >
              {card.description}
            </p>
          )}

          {/* Upright / Reversed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{
                background: `${suitColor}0d`,
                border: `1px solid ${suitColor}28`,
              }}
            >
              <div
                className="text-xs tracking-widest mb-2"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: suitColor,
                  opacity: 0.75,
                }}
              >
                ↑ UPRIGHT
              </div>
              <p
                style={{
                  fontFamily: "EB Garamond, serif",
                  color: "rgba(245,230,200,0.78)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {card.upright}
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <div
                className="text-xs tracking-widest mb-2"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "rgba(139,92,246,0.8)",
                }}
              >
                ↓ REVERSED
              </div>
              <p
                style={{
                  fontFamily: "EB Garamond, serif",
                  color: "rgba(245,230,200,0.78)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {card.reversed}
              </p>
            </div>
          </div>

          {/* Wisdom */}
          {card.wisdomMessage && (
            <div
              className="p-4 rounded-xl text-center"
              style={{
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.18)",
              }}
            >
              <p
                className="text-base italic"
                style={{
                  fontFamily: "EB Garamond, serif",
                  color: "rgba(212,175,55,0.8)",
                  fontSize: "1.1rem",
                }}
              >
                "{card.wisdomMessage}"
              </p>
            </div>
          )}

          {/* Flip hint */}
          <p
            className="text-center text-xs"
            style={{
              fontFamily: "Cinzel, serif",
              color: "rgba(212,175,55,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            CLICK CARD TO FLIP · SPACE TO TOGGLE · ESC TO CLOSE
          </p>

          {/* Prev / Next */}
          {(onPrev || onNext) && (
            <div className="flex justify-between mt-2">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-30"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "rgba(212,175,55,0.7)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "transparent",
                  letterSpacing: "0.1em",
                }}
              >
                <ChevronLeft size={14} /> PREV DRAWN
              </button>
              <button
                onClick={onNext}
                disabled={!onNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-30"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "rgba(212,175,55,0.7)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "transparent",
                  letterSpacing: "0.1em",
                }}
              >
                NEXT DRAWN <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main CardSpread component ────────────────────────────────────────────────
export default function CardSpread() {
  const [arcOffsetDeg, setArcOffsetDeg] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [drawnIndices, setDrawnIndices] = useState<Set<number>>(new Set());
  const [drawnHistory, setDrawnHistory] = useState<TarotCard[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentArcOffset = useRef(0);
  const targetArcOffset = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Smooth lerp animation loop — runs continuously while mouse is active
  const animateArc = useCallback(() => {
    const diff = targetArcOffset.current - currentArcOffset.current;
    if (Math.abs(diff) > 0.005) {
      // Very slow lerp factor = smooth, cinematic feel
      currentArcOffset.current = lerp(currentArcOffset.current, targetArcOffset.current, 0.04);
      setArcOffsetDeg(currentArcOffset.current);
      rafRef.current = requestAnimationFrame(animateArc);
    } else {
      currentArcOffset.current = targetArcOffset.current;
      setArcOffsetDeg(currentArcOffset.current);
      rafRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalise mouse X across the full container width: 0 (left) → 1 (right)
      const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      // Map to arc offset: left edge = -ROLL_RANGE_DEG, right edge = +ROLL_RANGE_DEG
      targetArcOffset.current = (t - 0.5) * 2 * ROLL_RANGE_DEG;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateArc);
      }
    },
    [animateArc]
  );

  const handleMouseLeave = useCallback(() => {
    targetArcOffset.current = 0;
    setHoveredIndex(null);
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animateArc);
    }
  }, [animateArc]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleCardClick = useCallback((card: TarotCard) => {
    const index = tarotCards.findIndex((c) => c.id === card.id);
    setDrawnIndices((prev) => new Set(Array.from(prev).concat(index)));
    setDrawnHistory((prev) => {
      const next = [...prev, card];
      setHistoryIndex(next.length - 1);
      return next;
    });
    setSelectedCard(card);
  }, []);

  const handleClose = useCallback(() => setSelectedCard(null), []);

  const handlePrev = useCallback(() => {
    setHistoryIndex((i) => {
      const next = Math.max(0, i - 1);
      setSelectedCard(drawnHistory[next]);
      return next;
    });
  }, [drawnHistory]);

  const handleNext = useCallback(() => {
    setHistoryIndex((i) => {
      const next = Math.min(drawnHistory.length - 1, i + 1);
      setSelectedCard(drawnHistory[next]);
      return next;
    });
  }, [drawnHistory]);

  const handleReset = useCallback(() => {
    setDrawnIndices(new Set());
    setDrawnHistory([]);
    setHistoryIndex(-1);
    setSelectedCard(null);
  }, []);

  return (
    <>
      <section
        id="draw-section"
        className="relative w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,8,24,0) 0%, rgba(8,4,18,0.97) 20%, #060310 100%)",
          paddingBottom: Math.ceil(EDGE_Y_DROP) + 30,
          overflow: "visible",
        }}
      >
        {/* ── Section heading (sits above the arch, never overlaps cards) ── */}
        <div className="text-center pt-10 pb-6 px-4 relative z-10">
          <p
            className="text-xs tracking-[0.35em] mb-3"
            style={{ fontFamily: "Cinzel, serif", color: "rgba(212,175,55,0.45)" }}
          >
            ✦ THE ORACLE SPEAKS ✦
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "Cinzel Decorative, serif", color: "#f5e6c8" }}
          >
            Draw Your Card
          </h2>
          <p
            className="text-base italic max-w-xl mx-auto"
            style={{
              fontFamily: "EB Garamond, serif",
              color: "rgba(212,175,55,0.6)",
              fontSize: "1.1rem",
            }}
          >
            Sweep your cursor across the spread to roll the deck. The card that calls to you — hover, then click to reveal its wisdom.
          </p>

          {drawnHistory.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-5">
              <span
                className="text-xs tracking-widest"
                style={{ fontFamily: "Cinzel, serif", color: "rgba(212,175,55,0.55)" }}
              >
                {drawnHistory.length} CARD{drawnHistory.length !== 1 ? "S" : ""} DRAWN
              </span>
              <button
                onClick={handleReset}
                className="text-xs tracking-widest px-4 py-1.5 rounded-full"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "rgba(212,175,55,0.65)",
                  border: "1px solid rgba(212,175,55,0.28)",
                  background: "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.color = "rgba(212,175,55,1)";
                  b.style.borderColor = "rgba(212,175,55,0.65)";
                  b.style.background = "rgba(212,175,55,0.08)";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.color = "rgba(212,175,55,0.65)";
                  b.style.borderColor = "rgba(212,175,55,0.28)";
                  b.style.background = "transparent";
                }}
              >
                RESHUFFLE DECK
              </button>
            </div>
          )}
        </div>

        {/* ── Ornamental divider ── */}
        <div
          className="mx-auto flex-shrink-0"
          style={{
            width: "50%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
          }}
        />

        {/* ── Arch spread container ── */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{
            height: `${CONTAINER_H}px`,
            cursor: "crosshair",
            overflow: "visible",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {tarotCards.map((card, i) => (
            <SpreadCard
              key={card.id}
              card={card}
              index={i}
              total={TOTAL_CARDS}
              arcOffsetDeg={arcOffsetDeg}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
              onClick={handleCardClick}
              isDrawn={drawnIndices.has(i)}
            />
          ))}
        </div>

        {/* ── Bottom fade ── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 80,
            background:
              "linear-gradient(0deg, #060310 0%, transparent 100%)",
            zIndex: 5,
          }}
        />
      </section>

      {/* ── Reveal modal ── */}
      <AnimatePresence>
        {selectedCard && (
          <RevealModal
            card={selectedCard}
            onClose={handleClose}
            onPrev={historyIndex > 0 ? handlePrev : undefined}
            onNext={
              historyIndex < drawnHistory.length - 1 ? handleNext : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
