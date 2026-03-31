// ═══════════════════════════════════════════════════════════
// HOME PAGE — Victorian Occultism / Art Nouveau Theme
// Deep indigo background, amethyst purple, aged gold
// Cinzel font for headings, EB Garamond for body text
//
// Page structure:
//   1. HeroSection
//   2. StickyNav  ← "Draw Your Card" | "Browse the Deck"
//   3. #draw-section  — CardSpread (arch fan)
//   4. #browse-section — Search + Filter + Card Grid
//   5. Footer
// ═══════════════════════════════════════════════════════════

import { useState, useCallback, useEffect, useRef } from "react";
import { tarotCards, searchCards, SUITS, type TarotCard, type TarotSuit } from "@/lib/tarotData";
import TarotCardComponent from "@/components/TarotCard";
import CardModal from "@/components/CardModal";
import SearchBar from "@/components/SearchBar";
import SuitFilter from "@/components/SuitFilter";
import HeroSection from "@/components/HeroSection";
import CardSpread from "@/components/CardSpread";

// ─── Sticky Section Navigator ────────────────────────────────────────────────
function StickyNav({ activeSection }: { activeSection: "draw" | "browse" }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(8,4,18,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-0 px-4 py-0">
        {/* Draw tab */}
        <button
          onClick={() => scrollTo("draw-section")}
          className="relative flex items-center gap-2 px-8 py-4 transition-all"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:
              activeSection === "draw"
                ? "rgba(212,175,55,1)"
                : "rgba(212,175,55,0.42)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>✦</span>
          Draw Your Card
          {activeSection === "draw" && (
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
              style={{ background: "rgba(212,175,55,0.75)" }}
            />
          )}
        </button>

        {/* Divider */}
        <span
          style={{
            width: 1,
            height: 20,
            background: "rgba(212,175,55,0.18)",
            display: "block",
            margin: "0 4px",
          }}
        />

        {/* Browse tab */}
        <button
          onClick={() => scrollTo("browse-section")}
          className="relative flex items-center gap-2 px-8 py-4 transition-all"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:
              activeSection === "browse"
                ? "rgba(212,175,55,1)"
                : "rgba(212,175,55,0.42)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>☽</span>
          Browse the Deck
          {activeSection === "browse" && (
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
              style={{ background: "rgba(212,175,55,0.75)" }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuit, setActiveSuit] = useState<TarotSuit | "All">("All");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [activeSection, setActiveSection] = useState<"draw" | "browse">("draw");

  const drawRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);

  // Intersection observer to update active section tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (entry.target.id === "draw-section") setActiveSection("draw");
            else if (entry.target.id === "browse-section") setActiveSection("browse");
          }
        }
      },
      { threshold: 0.3 }
    );
    if (drawRef.current) observer.observe(drawRef.current);
    if (browseRef.current) observer.observe(browseRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredCards = useCallback(() => {
    let cards = searchQuery ? searchCards(searchQuery) : tarotCards;
    if (activeSuit !== "All") {
      cards = cards.filter((c) => c.suit === activeSuit);
    }
    return cards;
  }, [searchQuery, activeSuit])();

  return (
    <div className="relative min-h-screen" style={{ background: "oklch(0.10 0.04 290)" }}>
      {/* Star field background */}
      <div className="star-field" aria-hidden="true" />

      {/* Radial gradient overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.25 0.12 295 / 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 100%, oklch(0.20 0.10 295 / 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 80%, oklch(0.18 0.08 295 / 0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10">

        {/* ── 1. Hero ── */}
        <HeroSection />

        {/* ── 2. Sticky Section Navigator ── */}
        <StickyNav activeSection={activeSection} />

        {/* ── 3. Draw Your Card Section ── */}
        <div id="draw-section" ref={drawRef}>
          <CardSpread />
        </div>

        {/* ── Section transition ── */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)",
            margin: "0 auto",
            maxWidth: "60%",
          }}
        />

        {/* ── 4. Browse the Deck Section ── */}
        <div id="browse-section" ref={browseRef} style={{ paddingTop: "4rem" }}>
          {/* Section heading */}
          <div className="text-center mb-8 px-4">
            <p
              className="text-xs tracking-[0.35em] mb-3"
              style={{ fontFamily: "Cinzel, serif", color: "rgba(212,175,55,0.45)" }}
            >
              ✦ THE ARCANE LIBRARY ✦
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: "Cinzel Decorative, serif", color: "#f5e6c8" }}
            >
              Browse the Deck
            </h2>
            <p
              className="text-base italic max-w-lg mx-auto"
              style={{ fontFamily: "EB Garamond, serif", color: "rgba(212,175,55,0.55)" }}
            >
              Explore all 78 Rider-Waite cards. Search by name, keyword, or filter by suit.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="container mx-auto px-4 pb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SuitFilter active={activeSuit} onSelect={setActiveSuit} />
          </div>

          {/* Results count */}
          <div className="container mx-auto px-4 pb-4">
            <div className="ornamental-divider">
              <span
                className="text-sm tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: "oklch(0.72 0.14 75)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                }}
              >
                {filteredCards.length === 78
                  ? "The Complete Deck — 78 Cards"
                  : `${filteredCards.length} Card${filteredCards.length !== 1 ? "s" : ""} Found`}
              </span>
            </div>
          </div>

          {/* Card Grid */}
          <div className="container mx-auto px-4 pb-20">
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    color: "oklch(0.65 0.08 295)",
                    fontSize: "1.1rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  No cards found in the arcane archives
                </div>
                <button
                  onClick={() => { setSearchQuery(""); setActiveSuit("All"); }}
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    color: "oklch(0.72 0.14 75)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    background: "none",
                    border: "1px solid oklch(0.72 0.14 75 / 0.4)",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Clear the Vision
                </button>
              </div>
            ) : (
              <div
                className="grid gap-5"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                }}
              >
                {filteredCards.map((card, index) => (
                  <TarotCardComponent
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 5. Footer ── */}
        <footer
          className="relative z-10 py-8 text-center"
          style={{
            borderTop: "1px solid oklch(0.30 0.10 295 / 30%)",
            background: "oklch(0.08 0.04 290 / 0.8)",
          }}
        >
          <div className="ornamental-divider container mx-auto px-4 mb-4">
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.72 0.14 75)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              ✦ The Rider-Waite Tarot ✦
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-garamond)",
              color: "oklch(0.55 0.08 295)",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            Illustrated by Pamela Colman Smith, 1909 · Public Domain
          </p>
          <p
            style={{
              fontFamily: "var(--font-garamond)",
              color: "oklch(0.45 0.06 295)",
              fontSize: "0.8rem",
              marginTop: "0.25rem",
            }}
          >
            Card meanings drawn from <em>The Ultimate Guide to Tarot</em> by Liz Dean
          </p>
        </footer>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
