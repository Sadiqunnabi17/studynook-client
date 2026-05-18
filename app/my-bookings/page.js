"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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

  useEffect(() => {
    document.title = "StudyNook – My Bookings";
    fetchBookings();
  }, []);

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-500 text-sm mb-8">Manage your study room reservations</p>

            {loading ? (
              <Spinner />
            ) : bookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">You have no bookings yet</h3>
                <p className="text-gray-500 text-sm">Browse rooms and book your perfect study space</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="flex flex-col md:flex-row">
                      {/* Room Image */}
                      <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                        {booking.room?.image ? (
                          <Image
                            src={booking.room.image}
                            alt={booking.room.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">🏠</span>
                          </div>
                        )}
                      </div>

                      {/* Booking Info */}
                      <div className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {booking.room?.name || "Room Deleted"}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-500">
                              <p>📅 {new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                              <p>⏰ {booking.startTime} – {booking.endTime}</p>
                              <p>📍 {booking.room?.floor}</p>
                              <p className="text-emerald-600 font-semibold">Total: ${booking.totalCost}</p>
                              {booking.specialNote && (
                                <p className="text-gray-400 italic">Note: {booking.specialNote}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {booking.status === "confirmed" ? "✓ Confirmed" : "✗ Cancelled"}
                            </span>

                            {/* Cancel Button */}
                            {booking.status === "confirmed" && isFutureDate(booking.date) && (
                              <button
                                onClick={() => setCancelModal(booking)}
                                className="text-sm text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Cancel Modal */}
        {cancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Booking</h3>
              <p className="text-gray-500 text-sm mb-2">
                Are you sure you want to cancel your booking for <strong>{cancelModal.room?.name}</strong>?
              </p>
              <p className="text-gray-400 text-xs mb-6">
                📅 {new Date(cancelModal.date).toLocaleDateString()} · ⏰ {cancelModal.startTime} – {cancelModal.endTime}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancel(cancelModal._id)}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition"
                >
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