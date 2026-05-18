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
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
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
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Available Study Rooms</h1>
          <p className="text-emerald-200">Find and book the perfect study space for you</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

                {/* Search */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search rooms..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="space-y-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="accent-emerald-600"
                        />
                        <span className="text-sm text-gray-600">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
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

            {/* Rooms Grid */}
            <div className="flex-1">
              {loading ? (
                <Spinner />
              ) : rooms.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">{rooms.length} room{rooms.length !== 1 ? "s" : ""} found</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <RoomCard key={room._id} room={room} />
                    ))}
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