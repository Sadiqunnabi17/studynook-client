"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);

  // useEffect(() => {
  //   document.title = "StudyNook – My Bookings";
  //   fetchBookings();
  // }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "StudyNook – My Bookings";
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      setBookings((prev) =>
        prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b)
      );
      setCancelModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const isFutureDate = (date) => {
    return new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
        <Navbar />
        <main className="flex-1 py-10 px-6">
          <div className="max-w-4xl mx-auto">

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-navy dark:text-cream">
                  My Bookings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Manage your study room reservations
                </p>
              </div>
              {/* Button to My Listings */}
              <Link href="/my-listings"
                className="bg-navy text-gold border border-gold px-4 py-2 rounded-xl
                  text-sm font-semibold hover:bg-gold hover:text-navy transition">
                My Listings
              </Link>
            </div>

            {loading ? <Spinner /> : bookings.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-navy/30 rounded-2xl
                border border-navy/8 dark:border-gold/15">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-navy dark:text-cream mb-2">
                  You have no bookings yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Browse available rooms and book your perfect study space
                </p>
                <Link href="/rooms"
                  className="bg-navy text-gold border border-gold px-6 py-2.5 rounded-xl
                    text-sm font-semibold hover:bg-gold hover:text-navy transition">
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id}
                    className="bg-white dark:bg-navy/30 rounded-2xl border
                      border-navy/8 dark:border-gold/15 overflow-hidden shadow-sm">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-40 flex-shrink-0">
                        {booking.room?.image ? (
                          <Image
                            src={booking.room.image}
                            alt={booking.room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                          />
                        ) : (
                          <div className="w-full h-full bg-navy/10 dark:bg-gold/10
                            flex items-center justify-center text-4xl">🏠</div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display font-semibold text-navy dark:text-cream text-lg mb-2">
                              {booking.room?.name || "Room Deleted"}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                              <p>📅 {new Date(booking.date).toLocaleDateString("en-US", {
                                weekday: "long", year: "numeric",
                                month: "long", day: "numeric"
                              })}</p>
                              <p>⏰ {booking.startTime} – {booking.endTime}</p>
                              <p>📍 {booking.room?.floor}</p>
                              <p className="text-gold font-semibold">Total: ${booking.totalCost}</p>
                              {booking.specialNote && (
                                <p className="italic text-gray-400">Note: {booking.specialNote}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${booking.status === "confirmed"
                                ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"}`}>
                              {booking.status === "confirmed" ? "✓ Confirmed" : "✗ Cancelled"}
                            </span>
                            {booking.status === "confirmed" && isFutureDate(booking.date) && (
                              <button
                                onClick={() => setCancelModal(booking)}
                                className="text-sm text-red-500 border border-red-300 px-3 py-1.5
                                  rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom link to browse more rooms */}
                <div className="text-center pt-4">
                  <Link href="/rooms"
                    className="inline-block border border-gold text-navy dark:text-gold
                      px-6 py-2.5 rounded-xl text-sm font-semibold
                      hover:bg-gold hover:text-navy transition">
                    Browse More Rooms
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        {cancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-navy-dark rounded-2xl p-6 max-w-sm w-full
              border border-navy/10 dark:border-gold/20">
              <h3 className="text-lg font-bold text-navy dark:text-cream mb-2">Cancel Booking</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                Are you sure you want to cancel your booking for{" "}
                <strong>{cancelModal.room?.name}</strong>?
              </p>
              <p className="text-gray-400 text-xs mb-6">
                📅 {new Date(cancelModal.date).toLocaleDateString()} · ⏰ {cancelModal.startTime} – {cancelModal.endTime}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 border border-navy/20 dark:border-gold/20 text-navy dark:text-cream
                    py-2.5 rounded-xl font-medium hover:bg-navy/5 dark:hover:bg-gold/5 transition">
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancel(cancelModal._id)}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium
                    hover:bg-red-600 transition">
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}