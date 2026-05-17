"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Study<span className="text-emerald-600">Nook</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
              Home
            </Link>
            <Link href="/rooms" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
              Rooms
            </Link>
            {user && (
              <>
                <Link href="/add-room" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
                  Add Room
                </Link>
                <Link href="/my-listings" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
                  My Listings
                </Link>
                <Link href="/my-bookings" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
                  My Bookings
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-emerald-500 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0]}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/my-listings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      My Listings
                    </Link>
                    <Link href="/my-bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">
                  Login
                </Link>
                <Link href="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}