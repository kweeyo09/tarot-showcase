// ═══════════════════════════════════════════════════════════
// HERO SECTION — Victorian Occultism / Art Nouveau Theme
// Cinzel Decorative for the title, ornamental details
// ═══════════════════════════════════════════════════════════

export default function HeroSection() {
  return (
    <header
      className="relative text-center py-12 px-4"
      style={{
        borderBottom: "1px solid oklch(0.30 0.10 295 / 30%)",
        background: `
          linear-gradient(
            180deg,
            oklch(0.15 0.08 295 / 0.6) 0%,
            transparent 100%
          )
        `,
      }}
    >
      {/* Decorative top line */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, oklch(0.72 0.14 75))",
          }}
        />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 1 L11.5 7.5 L18 10 L11.5 12.5 L10 19 L8.5 12.5 L2 10 L8.5 7.5 Z"
            fill="oklch(0.72 0.14 75)"
            opacity="0.8"
          />
        </svg>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, oklch(0.72 0.14 75), transparent)",
          }}
        />
      </div>

      {/* Subtitle */}
      <p
        className="tracking-widest uppercase mb-3"
        style={{
          fontFamily: "var(--font-cinzel)",
          color: "oklch(0.72 0.14 75)",
          fontSize: "0.65rem",
          letterSpacing: "0.35em",
        }}
      >
        The Complete Rider-Waite Deck
      </p>

      {/* Main Title */}
      <h1
        className="text-glow-gold mb-3"
        style={{
          fontFamily: "var(--font-cinzel-decorative)",
          color: "oklch(0.92 0.04 80)",
          fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          lineHeight: 1.1,
          textShadow: `
            0 0 20px oklch(0.82 0.18 75 / 0.4),
            0 0 40px oklch(0.72 0.14 75 / 0.2),
            0 2px 4px oklch(0.05 0.03 290 / 0.8)
          `,
        }}
      >
        Tarot Arcana
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "var(--font-garamond)",
          color: "oklch(0.72 0.10 295)",
          fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
          fontStyle: "italic",
          letterSpacing: "0.03em",
          maxWidth: "500px",
          margin: "0 auto 1.5rem",
        }}
      >
        Explore the ancient wisdom of the 78 cards
      </p>

      {/* Stats row */}
      <div
        className="flex items-center justify-center gap-8 flex-wrap"
        style={{ marginBottom: "0.5rem" }}
      >
        {[
          { label: "Major Arcana", value: "22" },
          { label: "Minor Arcana", value: "56" },
          { label: "Total Cards", value: "78" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.82 0.18 75)",
                fontSize: "1.4rem",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-cinzel)",
                color: "oklch(0.55 0.08 295)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "0.2rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Decorative bottom line */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div
          style={{
            width: "80px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, oklch(0.72 0.14 75 / 0.5))",
          }}
        />
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "oklch(0.72 0.14 75)",
            boxShadow: "0 0 8px oklch(0.82 0.18 75 / 0.6)",
          }}
        />
        <div
          style={{
            width: "80px",
            height: "1px",
            background: "linear-gradient(90deg, oklch(0.72 0.14 75 / 0.5), transparent)",
          }}
        />
      </div>
    </header>
  );
}
