import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Search</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Search animal welfare documents, applicable standards, and precedent
        across your organisation&apos;s corpus.
      </p>
      <div className="finding-card">
        <p className="text-body-sm text-mid-grey">
          Search interface — filters left, results centre, preview right.
        </p>
      </div>
    </div>
  );
}
