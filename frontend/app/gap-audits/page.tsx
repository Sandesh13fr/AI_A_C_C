import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gap audit",
};

export default function GapAuditsPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Gap audit</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Detect absent protections by comparing document scope against applicable
        regulatory and advocacy standards.
      </p>
    </div>
  );
}
