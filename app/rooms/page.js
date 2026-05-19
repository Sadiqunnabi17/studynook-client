"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";

const AMENITIES = ["Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"];

function RoomCard({ room }) {
  return (
    <div className="bg-white dark:bg-navy/30 rounded-2xl border border-navy/8 dark:border-gold/15
      overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-gold
      transition-all duration-300 flex flex-col">
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
        <h3 className="font-display text-lg font-bold mb-2 text-navy dark:text-cream">
          {room.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
          {room.description.slice(0, 90)}{room.description.length > 90 ? "..." : ""}
        </p>
        <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>📍 {room.floor}</span>
          <span>👥 {room.capacity} people</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs px-2.5 py-1 rounded-full border
              bg-navy/5 dark:bg-gold/10 text-navy dark:text-gold
              border-navy/12 dark:border-gold/20">
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        <div className="mt-auto">
          <Link href={`/rooms/${room._id}`}
            className="block w-full text-center bg-navy dark:bg-navy text-gold border border-gold
              py-2 rounded-lg text-sm font-semibold
              hover:bg-gold hover:text-navy transition-all duration-200">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    document.title = "StudyNook – Available Rooms";
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [search, selectedAmenities]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(",");
      const res = await api.get("/rooms", { params });
      setRooms(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />

      {/* Header */}
      <div className="bg-navy dark:bg-navy-dark border-b border-gold/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            University Library
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Available Study Rooms
          </h1>
          <p className="text-white/60 mt-2">Find and book the perfect study space for you</p>
        </div>
      </div>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-navy/30 rounded-2xl border border-navy/8 dark:border-gold/15 p-5 sticky top-20">
                <h3 className="font-semibold text-navy dark:text-cream mb-4">Filters</h3>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-navy dark:text-cream/80 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search rooms..."
                    className="w-full border border-navy/20 dark:border-gold/20 rounded-lg px-3 py-2
                      text-sm outline-none bg-cream dark:bg-navy-dark
                      text-navy dark:text-cream
                      focus:border-gold transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream/80 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="accent-gold"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {(search || selectedAmenities.length > 0) && (
                  <button
                    onClick={() => { setSearch(""); setSelectedAmenities([]); }}
                    className="mt-4 w-full text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {loading ? <Spinner /> : rooms.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-navy dark:text-cream mb-2">No rooms found</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {rooms.length} room{rooms.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}