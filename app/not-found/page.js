import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-emerald-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}