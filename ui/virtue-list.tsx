import { useEffect, useRef, useState } from "react"
import { VectorField } from "@/components/ui/vector-field"

/**
 * VirtueList — scroll-driven, dead simple.
 */

const WORDS = [
  "Honesty",
  "Loyalty",
  "Bravery",
  "Self Discipline",
  "Fortitude",
  "Adaptability",
  "Commitment",
  "Excellence",
  "Unity",
  "Faith",
  "Sacrifice",
  "Learning",
  "Curiosity",
]

const ITEM = 130 // px per word — also set in inline style below

export function VirtueList() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [trackY, setTrackY] = useState(0) // px to translate the list up
  const [active, setActive] = useState(0) // index of active word

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable)
      const ratio = scrollable > 0 ? scrolled / scrollable : 0
      const activeFloat = ratio * (WORDS.length - 1)

      setTrackY(activeFloat * ITEM)
      setActive(Math.round(activeFloat))
    }

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ height: `calc(100vh * ${WORDS.length})` }}
      className="relative w-full bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Intro text */}
        <div className="absolute top-16 z-20 text-center px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
            We the students of PRIYESH Sir
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            We stand for <span className="bg-gradient-to-r from-yellow-200 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Thirteen Values</span> that shape everything we do.
          </h2>
        </div>

        {/* Vector-field particle animation — sits behind the words. */}
        <div className="absolute inset-0 z-0">
          <VectorField className="h-full w-full" color="120 120 140" particleCount={160} speed={0.8} />
        </div>

        {/* Moving word list */}
        <div
          className="relative z-10 flex flex-col items-center mt-12"
          style={{
            transform: `translateY(-${trackY}px)`,
            transition: "transform 80ms linear",
            willChange: "transform",
          }}
        >
          {WORDS.map((w, i) => (
            <div
              key={w}
              className={
                "virtue-word flex items-center justify-center whitespace-nowrap text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl " +
                (i === active ? "virtue-active" : "")
              }
              style={{ height: `${ITEM}px` }}
            >
              <span
                className="virtue-arrow mr-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                aria-hidden="true"
              >
                →
              </span>
              {w}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.3em] text-neutral-400 z-20">
          scroll ↓
        </div>

        <style>{`
          .virtue-word {
            color: #525252;
            opacity: 0.7;
            transform: scale(1);
            text-shadow: none;
            transition:
              color 500ms ease,
              opacity 500ms ease,
              transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1),
              text-shadow 500ms ease;
          }
          .virtue-word .virtue-arrow {
            opacity: 0;
            transform: translateX(8px);
            transition: opacity 300ms ease, transform 300ms ease;
          }
          .virtue-word.virtue-active {
            color: #ffffff;
            opacity: 1;
            transform: scale(1.25);
            text-shadow: 0 0 40px rgba(255,255,255,0.5), 0 0 90px rgba(255,255,255,0.25);
          }
          .virtue-word.virtue-active .virtue-arrow {
            opacity: 1;
            transform: translateX(0);
          }
        `}</style>
      </div>
    </section>
  )
}
