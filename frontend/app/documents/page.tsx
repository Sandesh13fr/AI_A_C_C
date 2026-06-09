import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Documents</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Browse and manage uploaded documents across your organisation.
      </p>
    </div>
  );
}
