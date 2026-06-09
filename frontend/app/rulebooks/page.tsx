import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rulebooks",
};

export default function RulebooksPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Rulebooks</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Author and manage custom advocacy standards above the legal floor.
      </p>
    </div>
  );
}
