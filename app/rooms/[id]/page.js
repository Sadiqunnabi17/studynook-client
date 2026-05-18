"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import toast from "react-hot-toast";
import Link from "next/link";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [booking, setBooking] = useState({
    date: "",
    startTime: "08:00",
    endTime: "09:00",
    specialNote: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      setRoom(res.data.data);
      document.title = `StudyNook – ${res.data.data.name}`;
    } catch (err) {
      toast.error("Room not found");
      router.push("/rooms");
    } finally {
      setLoading(false);
    }
  };

  const totalCost = () => {
    const start = parseInt(booking.startTime);
    const end = parseInt(booking.endTime);
    const hours = end - start;
    return hours > 0 ? hours * room.hourlyRate : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!booking.date) return toast.error("Please select a date");
    const start = parseInt(booking.startTime);
    const end = parseInt(booking.endTime);
    if (end <= start) return toast.error("End time must be after start time");

    setBookingLoading(true);
    try {
      await api.post("/bookings", {
        roomId: id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalCost: totalCost(),
        specialNote: booking.specialNote,
      });
      toast.success("Room booked successfully!");
      setShowBooking(false);
      fetchRoom();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted successfully");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const isOwner = user && room && room.owner._id === user.id;
  const today = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
      <Footer />
    </div>
  );

  if (!room) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Rooms
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Image */}
            <div className="relative h-72 w-full">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {room.bookingCount} bookings
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>📍 {room.floor}</span>
                    <span>👥 {room.capacity} people</span>
                    <span className="text-emerald-600 font-semibold text-base">${room.hourlyRate}/hr</span>
                  </div>
                </div>

                {/* Owner actions */}
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      href={`/rooms/${id}/edit`}
                      className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{room.description}</p>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <span key={a} className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1.5 rounded-full border border-emerald-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Owner info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                {room.owner.image ? (
                  <Image
                    src={room.owner.image}
                    alt={room.owner.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                    {room.owner.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{room.owner.name}</p>
                  <p className="text-xs text-gray-500">Room Owner</p>
                </div>
              </div>

              {/* Book Now */}
              {!isOwner && (
                user ? (
                  <button
                    onClick={() => setShowBooking(!showBooking)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
                  >
                    {showBooking ? "Close Booking Form" : "Book Now"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
                  >
                    Login to Book
                  </Link>
                )
              )}

              {/* Booking Form */}
              {showBooking && (
                <form onSubmit={handleBooking} className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Book This Room</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        min={today}
                        value={booking.date}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <select
                        value={booking.startTime}
                        onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                      >
                        {TIME_SLOTS.slice(0, -1).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <select
                        value={booking.endTime}
                        onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                      >
                        {TIME_SLOTS.slice(1).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                      <div className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-emerald-600 font-semibold">
                        ${totalCost()}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Note (optional)</label>
                    <textarea
                      value={booking.specialNote}
                      onChange={(e) => setBooking({ ...booking, specialNote: e.target.value })}
                      rows={2}
                      placeholder="Any special requirements..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {bookingLoading ? "Confirming..." : "Confirm Booking"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Room</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <strong>{room.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}