"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";
import { useTheme } from "@/context/ThemeContext";

function RoomCard({ room }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col
      hover:-translate-y-1 hover:shadow-xl hover:border-gold
      ${isDark
        ? "bg-navy/30 border-gold/15"
        : "bg-white border-navy/8 shadow-sm"}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
        <div className="absolute top-3 right-3 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
          ${room.hourlyRate}/hr
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className={`font-display text-lg font-bold mb-2
          ${isDark ? "text-cream" : "text-navy"}`}>
          {room.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 leading-relaxed line-clamp-2">
          {room.description.slice(0, 90)}{room.description.length > 90 ? "..." : ""}
        </p>
        <div className="flex gap-3 text-xs text-gray-500 mb-3">
          <span>📍 {room.floor}</span>
          <span>👥 {room.capacity} people</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className={`text-xs px-2.5 py-1 rounded-full border
              ${isDark
                ? "bg-gold/10 text-gold border-gold/20"
                : "bg-navy/5 text-navy border-navy/12"}`}>
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        <div className="mt-auto">
          <Link href={`/rooms/${room._id}`}
            className="block w-full text-center bg-navy text-gold border border-gold
              py-2 rounded-lg text-sm font-semibold no-underline
              hover:bg-gold hover:text-navy transition-all duration-200">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = "StudyNook – University Library";
    api.get("/rooms/latest")
      .then((res) => setRooms(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-navy-dark" : "bg-cream"}`}>
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light py-20 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              <span className="text-gold text-xs font-medium tracking-widest uppercase">
                Central University Library
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Reserve Your Perfect
              <em className="text-gold italic block mt-1">Study Space</em>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg font-light">
              Access dedicated study rooms, collaborative spaces, and private reading areas across our university library — designed for students and faculty alike.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/rooms"
                className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30">
                Explore Rooms
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/register"
                className="inline-flex items-center gap-2 text-white border border-white/30 font-medium px-7 py-3 rounded-xl no-underline transition-all hover:border-white/70 hover:bg-white/8">
                Get Started Free
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
              {[
                { num: "50+", label: "Study Rooms" },
                { num: "1,200+", label: "Students" },
                { num: "4.9★", label: "Rating" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-gold">{num}</div>
                  <div className="text-xs text-white/50 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Library Image */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/20 aspect-[4/3] relative">
              <Image
                src="https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80"
                alt="University Library"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/30 to-transparent" />
            </div>

            {/* Floating card 1 */}
            <div className={`absolute -bottom-5 -left-5 rounded-2xl px-4 py-3 shadow-xl border
              ${isDark ? "bg-navy-dark/95 border-gold/20" : "bg-white/95 border-navy/10"}`}>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available Today</div>
              <div className={`font-display text-2xl font-bold ${isDark ? "text-cream" : "text-navy"}`}>12 Rooms</div>
              <div className="text-xs text-gold font-medium">Ready to book</div>
            </div>

            {/* Floating card 2 */}
            <div className="absolute -top-4 -right-4 bg-gold rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-xs text-navy font-semibold uppercase tracking-wider">Open Hours</div>
              <div className="text-navy font-bold text-lg mt-1">8AM – 10PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABLE ROOMS */}
      <section className={`py-20 px-6 ${isDark ? "bg-navy-dark" : "bg-cream"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
                Featured Spaces
              </p>
              <h2 className={`font-display text-3xl md:text-4xl font-bold ${isDark ? "text-cream" : "text-navy"}`}>
                Available Study Rooms
              </h2>
            </div>
            <Link href="/rooms"
              className="hidden md:inline-flex items-center gap-2 text-gold border border-gold px-5 py-2 rounded-lg text-sm font-semibold no-underline hover:bg-gold hover:text-navy transition-all">
              All Available Rooms
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {loading ? <Spinner /> : rooms.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No rooms available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, 3).map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link href="/rooms"
              className="inline-flex items-center gap-2 text-gold border border-gold px-6 py-2.5 rounded-lg text-sm font-semibold no-underline hover:bg-gold hover:text-navy transition-all">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`py-20 px-6 border-y
        ${isDark ? "bg-navy/20 border-gold/10" : "bg-navy/3 border-navy/8"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className={`font-display text-3xl md:text-4xl font-bold ${isDark ? "text-cream" : "text-navy"}`}>
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🔍", title: "Browse Rooms", desc: "Explore our wide selection of study rooms filtered by capacity, floor, and available amenities." },
              { step: "02", icon: "📅", title: "Book Your Slot", desc: "Select your preferred date and time slot. Our system instantly confirms your reservation." },
              { step: "03", icon: "📚", title: "Study & Focus", desc: "Arrive at your booked room and enjoy a productive, distraction-free study session." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step}
                className={`p-8 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold
                  ${isDark ? "bg-navy/30 border-gold/12" : "bg-white border-navy/8 shadow-sm"}`}>
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Step {step}</div>
                <h3 className={`font-display text-lg font-bold mb-3 ${isDark ? "text-cream" : "text-navy"}`}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={`py-20 px-6 ${isDark ? "bg-navy-dark" : "bg-cream"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Why StudyNook</p>
            <h2 className={`font-display text-3xl md:text-4xl font-bold ${isDark ? "text-cream" : "text-navy"}`}>
              Built for Academic Excellence
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏛️", title: "University Grade", desc: "Purpose-built spaces meeting the highest academic standards." },
              { icon: "⚡", title: "Instant Booking", desc: "Reserve your room in seconds with real-time availability." },
              { icon: "🔒", title: "Secure Access", desc: "JWT-protected accounts keeping your bookings safe." },
              { icon: "📱", title: "Any Device", desc: "Fully responsive — book from your phone, tablet, or laptop." },
            ].map(({ icon, title, desc }) => (
              <div key={title}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg
                  ${isDark ? "bg-navy/30 border-gold/12" : "bg-white border-navy/8 shadow-sm"}`}>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className={`font-display text-base font-bold mb-2 ${isDark ? "text-cream" : "text-navy"}`}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-navy-dark via-navy to-navy-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your<br />
            <em className="text-gold italic">Perfect Study Spot?</em>
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-8">
            Join thousands of students and faculty who have already discovered the convenience of StudyNook.
          </p>
          <Link href="/rooms"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30">
            Browse All Rooms
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}