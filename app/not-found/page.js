"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "StudyNook – Page Not Found";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="text-8xl font-display font-bold text-gold mb-4">404</div>
          <h1 className="text-2xl font-bold text-navy dark:text-cream mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved. Head back to browse our available study rooms.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-navy text-gold border border-gold
              px-6 py-3 rounded-xl font-semibold hover:bg-gold hover:text-navy transition">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}