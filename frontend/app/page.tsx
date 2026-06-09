export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="text-display-xl mb-5">OpenPaws</h1>
      <p className="text-body text-mid-grey mb-8 max-w-xl">
        Upload animal welfare documents, search applicable standards, and review
        AI-assisted potential risks with citations and human sign-off.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-button bg-teal px-6 py-3 text-body-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Sign in
        </a>
        <a
          href="/search"
          className="inline-flex items-center justify-center rounded-button border border-teal px-6 py-3 text-body-sm font-semibold text-teal transition-colors hover:bg-teal hover:text-white"
        >
          Search documents
        </a>
      </div>
    </div>
  );
}
