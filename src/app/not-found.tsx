import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-8xl font-black tracking-tighter text-gray-100 mb-0">404</p>
        <h1 className="text-3xl font-bold mt-2 mb-4">Page Not Found</h1>
        <p className="text-xl text-muted mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex bg-accent text-white px-8 py-4 font-bold hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
