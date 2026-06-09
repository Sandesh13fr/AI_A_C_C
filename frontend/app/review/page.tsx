import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review queue",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Review queue</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Triage and review AI-assisted findings. Accept, dismiss, edit, or
        comment before sign-off.
      </p>
    </div>
  );
}
