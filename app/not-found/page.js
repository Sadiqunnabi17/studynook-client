import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="font-display text-8xl font-bold text-gold mb-4">404</div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-cream mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/"
            className="bg-navy text-gold border border-gold px-8 py-3 rounded-xl
              font-semibold hover:bg-gold hover:text-navy transition">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}