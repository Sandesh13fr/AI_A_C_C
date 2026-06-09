import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <h1 className="text-h2 mb-6 text-center">Sign in to OpenPaws</h1>
        <p className="text-body-sm text-mid-grey mb-8 text-center">
          Sign in with your organisation credentials to access the compliance workspace.
        </p>
        <div className="flex justify-center">
          <a
            href="/search"
            className="inline-flex items-center justify-center rounded-button bg-teal px-6 py-3 text-body-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Continue to search
          </a>
        </div>
      </div>
    </div>
  );
}
