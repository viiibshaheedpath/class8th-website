import { VirtueList } from "@/components/ui/virtue-list"

/**
 * Demo: a full landing-page-style layout with the scroll-driven VirtueList
 * sandwiched between intro and outro sections. Scroll down to advance words.
 */
export default function VirtueListDemo() {
  return (
    <div className="w-full bg-neutral-950 text-white">
      {/* Intro */}
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-base font-medium italic text-neutral-300 sm:text-lg">
          we the students of PRIYESH sir..
        </p>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
          we stand for
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Thirteen values that shape everything we do.
        </h1>
        <p className="mt-6 max-w-xl text-base text-neutral-400 sm:text-lg">
          Scroll to move through them one by one.
        </p>
      </section>

      {/* Scroll-driven word list (renders its own ~13 screens of scroll height) */}
      <VirtueList />

      {/* Outro */}
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
          That's who we are.
        </h2>
        <p className="mt-4 text-neutral-400">Built on the basics. Done well.</p>
      </section>
    </div>
  )
}
