"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";
import toast from "react-hot-toast";

export default function MyListings() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   document.title = "StudyNook – My Listings";
  //   fetchWishlist();
  // }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/users/wishlist");
      setWishlist(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "StudyNook – My Listings";
    fetchWishlist();
  }, []);
  
  
  const handleRemove = async (roomId) => {
    try {
      await api.patch(`/users/wishlist/${roomId}`);
      setWishlist((prev) => prev.filter((r) => r._id !== roomId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
        <Navbar />
        <main className="flex-1 py-10 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-navy dark:text-cream">
                  My Listings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Your saved study rooms
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/my-bookings"
                  className="border border-navy/20 dark:border-gold/20 text-navy dark:text-cream
                    px-4 py-2 rounded-xl text-sm font-semibold
                    hover:bg-navy/5 dark:hover:bg-gold/5 transition">
                  My Bookings
                </Link>
                <Link href="/rooms"
                  className="bg-navy text-gold border border-gold px-4 py-2 rounded-xl
                    text-sm font-semibold hover:bg-gold hover:text-navy transition">
                  Browse Rooms
                </Link>
              </div>
            </div>

            {loading ? <Spinner /> : wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-navy/30 rounded-2xl
                border border-navy/8 dark:border-gold/15">
                <div className="text-5xl mb-4">🔖</div>
                <h3 className="text-lg font-semibold text-navy dark:text-cream mb-2">
                  No saved rooms yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Browse rooms and save your favourites here
                </p>
                <Link href="/rooms"
                  className="bg-navy text-gold border border-gold px-6 py-2.5 rounded-xl
                    text-sm font-semibold hover:bg-gold hover:text-navy transition">
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((room) => (
                  <div key={room._id}
                    className="bg-white dark:bg-navy/30 rounded-2xl border
                      border-navy/8 dark:border-gold/15 overflow-hidden shadow-sm">
                    <div className="relative h-44 w-full">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-3 right-3 bg-gold text-navy
                        text-xs font-bold px-2 py-1 rounded-full">
                        {room.bookingCount || 0} bookings
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-navy dark:text-cream mb-1">
                        {room.name}
                      </h3>
                      <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>📍 {room.floor}</span>
                        <span>👥 {room.capacity}</span>
                        <span className="text-gold font-medium">${room.hourlyRate}/hr</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/rooms/${room._id}`}
                          className="flex-1 text-center bg-gold text-navy py-2 rounded-lg
                            text-sm font-semibold hover:bg-navy hover:text-gold
                            border border-gold transition">
                          Book Now
                        </Link>
                        <button
                          onClick={() => handleRemove(room._id)}
                          className="flex-1 border border-red-400 text-red-500 py-2 rounded-lg
                            text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}