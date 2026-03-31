// ═══════════════════════════════════════════════════════════
// HOME PAGE — Victorian Occultism / Art Nouveau Theme
// Deep indigo background, amethyst purple, aged gold
// Cinzel font for headings, EB Garamond for body text
// ═══════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { tarotCards, searchCards, SUITS, SUIT_ELEMENTS, type TarotCard, type TarotSuit } from "@/lib/tarotData";
import TarotCardComponent from "@/components/TarotCard";
import CardModal from "@/components/CardModal";
import SearchBar from "@/components/SearchBar";
import SuitFilter from "@/components/SuitFilter";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuit, setActiveSuit] = useState<TarotSuit | "All">("All");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

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
        {/* Hero / Header */}
        <HeroSection />

        {/* Search & Filter Section */}
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
        <div className="container mx-auto px-4 pb-16">
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

        {/* Footer */}
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
