import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis",
};

export default function AnalysisPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Analysis results</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Review AI-assisted analysis findings with citations, confidence scores,
        and human sign-off status.
      </p>
    </div>
  );
}
