"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#1e3a5f"/>
        <path d="M8 26V12l10-4 10 4v14" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
        <rect x="14" y="18" width="8" height="8" rx="1" fill="#c9a84c" opacity="0.9"/>
        <path d="M10 14h16M10 18h4M22 18h4" stroke="#c9a84c" strokeWidth="1.2" opacity="0.6"/>
      </svg>
      <div>
        <div className="font-display text-lg font-bold leading-none text-navy dark:text-cream">
          StudyNook
        </div>
        <div className="text-xs leading-none text-gold tracking-widest">
          UNIVERSITY LIBRARY
        </div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all
        ${isDark
          ? "bg-gold/10 text-gold hover:bg-gold/20"
          : "bg-navy/8 text-navy hover:bg-navy/15"}`}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setDropdownOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    ...(user ? [
      { label: "Add Room", href: "/add-room" },
      { label: "My Listings", href: "/my-listings" },
      { label: "My Bookings", href: "/my-bookings" },
    ] : []),
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b
      ${isDark
        ? "bg-navy-dark/95 border-gold/10"
        : "bg-cream/95 border-navy/10"}
      ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* LEFT — Logo */}
        <div className="flex-1">
          <Logo />
        </div>

        {/* CENTER — Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium transition-colors duration-200
                ${isDark
                  ? "text-cream/85 hover:text-gold"
                  : "text-navy hover:text-gold"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Theme + Auth */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {user ? (
            <>
              <ThemeToggle />
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-full transition-colors
                    ${isDark ? "hover:bg-gold/10" : "hover:bg-navy/5"}`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={34}
                      height={34}
                      className="rounded-full border-2 border-gold object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-navy border-2 border-gold flex items-center justify-center text-gold font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`hidden md:block text-sm font-medium
                    ${isDark ? "text-cream" : "text-navy"}`}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={isDark ? "#f8f7f2" : "#1e3a5f"} strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden z-50
                    ${isDark ? "bg-navy-dark border-gold/20" : "bg-white border-navy/10"}`}>
                    <div className={`px-4 py-3 border-b
                      ${isDark ? "border-white/8" : "border-gray-100"}`}>
                      <p className={`text-sm font-semibold
                        ${isDark ? "text-cream" : "text-navy"}`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {[
                      { label: "My Listings", href: "/my-listings" },
                      { label: "My Bookings", href: "/my-bookings" },
                    ].map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors
                          ${isDark
                            ? "text-cream/80 hover:bg-gold/8 hover:text-gold"
                            : "text-navy hover:bg-gray-50"}`}
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2.5 text-sm text-red-500 
                        transition-colors border-t hover:bg-red-50
                        ${isDark ? "border-white/8" : "border-gray-100"}`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/login"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors
                  ${isDark
                    ? "text-cream/85 hover:text-gold"
                    : "text-navy hover:text-gold"}`}>
                Login
              </Link>
              <Link href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all
                  bg-navy text-gold border border-gold hover:bg-gold hover:text-navy">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}