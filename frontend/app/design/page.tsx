import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design system",
};

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-5xl p-5">
      <h1 className="text-h2 mb-8">Design system</h1>

      <section className="mb-8">
        <h2 className="text-h3 mb-4">Colour palette</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF", text: "text-black" },
            { name: "Teal", hex: "#006C67" },
            { name: "Teal glow", hex: "#00D7C8" },
            { name: "Mid grey", hex: "#888888" },
            { name: "Gold", hex: "#D19900" },
            { name: "Coral", hex: "#FF8552" },
            { name: "Peach", hex: "#FFE1D1", text: "text-black" },
          ].map((c) => (
            <div key={c.hex} className="finding-card">
              <div
                className="mb-2 h-12 w-full rounded"
                style={{ backgroundColor: c.hex }}
              />
              <p className={`font-mono text-micro ${c.text ?? "text-white"}`}>
                {c.hex}
              </p>
              <p className={`font-mono text-micro ${c.text ?? "text-white"}`}>
                {c.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-h3 mb-4">Typography</h2>
        <div className="finding-card mb-3">
          <p className="text-display-xl mb-1">Display XL</p>
          <p className="font-mono text-micro text-mid-grey">DM Serif Display 72px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-h1 mb-1">Heading 1</p>
          <p className="font-mono text-micro text-mid-grey">DM Serif Display 40–56px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-h2 mb-1">Heading 2</p>
          <p className="font-mono text-micro text-mid-grey">DM Serif Display or Space Grotesk 28–36px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-h3 mb-1">Heading 3</p>
          <p className="font-mono text-micro text-mid-grey">Space Grotesk 22–24px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-body mb-1">Body text — the quick brown fox jumps over the lazy dog.</p>
          <p className="font-mono text-micro text-mid-grey">Space Grotesk 15–16px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-body-sm mb-1">Body small — the quick brown fox jumps over the lazy dog.</p>
          <p className="font-mono text-micro text-mid-grey">Space Grotesk 13–14px</p>
        </div>
        <div className="finding-card mb-3">
          <p className="text-label mb-1">LABEL TEXT — CITATION ID JURISDICTION</p>
          <p className="font-mono text-micro text-mid-grey">JetBrains Mono 11–12px</p>
        </div>
        <div className="finding-card">
          <p className="text-micro mb-1">Micro text — 2026-06-05 · v2.1.0 · 0.82 cal</p>
          <p className="font-mono text-micro text-mid-grey">JetBrains Mono 10–11px</p>
        </div>
      </section>

      <section>
        <h2 className="text-h3 mb-4">Components</h2>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-button bg-teal px-5 py-2 text-body-sm font-semibold text-white transition-opacity hover:opacity-90" type="button">
            Primary action
          </button>
          <button className="rounded-button border border-teal px-5 py-2 text-body-sm font-semibold text-teal transition-colors hover:bg-teal hover:text-white" type="button">
            Secondary
          </button>
          <button className="rounded-button px-5 py-2 text-body-sm font-semibold text-mid-grey transition-colors hover:text-white" type="button">
            Ghost
          </button>
          <button className="rounded-button bg-[#D92D20] px-5 py-2 text-body-sm font-semibold text-white transition-opacity hover:opacity-90" type="button">
            Destructive
          </button>
          <button className="rounded-button bg-teal/50 px-5 py-2 text-body-sm font-semibold text-white/50" type="button" disabled>
            Disabled
          </button>
        </div>
      </section>
    </div>
  );
}
