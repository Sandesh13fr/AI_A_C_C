import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports & exports",
};

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Reports &amp; exports</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Generate and download PDF and CSV reports with citations, confidence
        scores, and review status.
      </p>
    </div>
  );
}
