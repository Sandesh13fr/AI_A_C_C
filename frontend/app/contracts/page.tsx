import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract analysis",
};

export default function ContractsPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Contract analysis</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Analyse contracts for welfare commitments, audit rights, and missing
        expected clauses.
      </p>
    </div>
  );
}
