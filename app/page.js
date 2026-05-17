"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";

function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{room.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {room.description.slice(0, 100)}{room.description.length > 100 ? "..." : ""}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>📍 {room.floor}</span>
          <span>👥 {room.capacity} people</span>
          <span className="text-emerald-600 font-semibold">${room.hourlyRate}/hr</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        <div className="mt-auto">
          <Link
            href={`/rooms/${room._id}`}
            className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
          >
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

  useEffect(() => {
    document.title = "StudyNook – Home";
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/latest");
        setRooms(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">Rooms available now</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="text-emerald-400 block">Study Room</span>
          </h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/rooms"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Explore Rooms
            </Link>
            <Link
              href="/register"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              List Your Room
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "50+", label: "Study Rooms" },
            { num: "1,200+", label: "Happy Students" },
            { num: "15+", label: "Library Locations" },
            { num: "4.9★", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-emerald-600">{num}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Rooms */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Available Now
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Study Rooms
              </h2>
            </div>
            <Link
              href="/rooms"
              className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No rooms available yet.</p>
              <Link href="/add-room" className="text-emerald-600 font-medium hover:underline mt-2 block">
                Be the first to add a room!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Browse Rooms", desc: "Explore available study rooms filtered by location, capacity, and amenities.", icon: "🔍" },
              { step: "02", title: "Book Your Slot", desc: "Select your preferred date and time slot. Instant confirmation guaranteed.", icon: "📅" },
              { step: "03", title: "Study & Focus", desc: "Arrive at your booked room and enjoy a distraction-free study session.", icon: "📚" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-emerald-600 text-sm font-bold mb-2">STEP {step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Study Spot?</h2>
          <p className="text-emerald-100 mb-8">
            Join thousands of students who have already found their perfect study space.
          </p>
          <Link
            href="/rooms"
            className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition"
          >
            Explore Rooms Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}