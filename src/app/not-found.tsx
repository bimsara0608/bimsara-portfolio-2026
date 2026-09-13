import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#09090b] text-foreground relative z-10">
      <div className="text-center max-w-lg">
        <p className="text-8xl sm:text-9xl font-black tracking-tighter text-white/10 select-none mb-0">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 mb-10 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, has been relocated, or is temporarily
          unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-white text-black px-7 py-3.5 rounded-xl font-bold hover:bg-zinc-200 transition-all text-sm shadow-lg shadow-white/10 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
