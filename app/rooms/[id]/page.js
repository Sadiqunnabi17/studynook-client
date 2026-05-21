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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [booking, setBooking] = useState({
    date: "",
    startTime: "08:00",
    endTime: "09:00",
    specialNote: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRoom();
    if (user) fetchWishlistStatus();
  }, [id, user]);

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

  const fetchWishlistStatus = async () => {
    try {
      const res = await api.get("/users/wishlist");
      const ids = res.data.data.map((r) => r._id);
      setIsWishlisted(ids.includes(id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const res = await api.patch(`/users/wishlist/${id}`);
      const wishlisted = res.data.data.wishlisted;
      setIsWishlisted(wishlisted);
      toast.success(wishlisted ? "Saved to My Listings!" : "Removed from My Listings");
    } catch (err) {
      toast.error("Failed to update wishlist");
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

  const today = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><Spinner /></div>
      <Footer />
    </div>
  );

  if (!room) return null;

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <Link href="/rooms"
            className="inline-flex items-center gap-2 text-sm text-gray-500
              dark:text-gray-400 hover:text-gold transition mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Rooms
          </Link>

          <div className="bg-white dark:bg-navy/30 rounded-2xl border
            border-navy/8 dark:border-gold/15 overflow-hidden shadow-sm">

            {/* Image */}
            <div className="relative h-72 w-full">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                  {room.bookingCount} bookings
                </span>
              </div>
              {/* Wishlist button on image */}
              {user && (
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2
                    rounded-full text-xs font-semibold backdrop-blur-sm transition-all
                    bg-white/20 hover:bg-white/40 text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={isWishlisted ? "#c9a84c" : "none"}
                    stroke={isWishlisted ? "#c9a84c" : "white"}
                    strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  {isWishlisted ? "Saved" : "Save"}
                </button>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-navy dark:text-cream mb-2">
                    {room.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>📍 {room.floor}</span>
                    <span>👥 {room.capacity} people</span>
                    <span className="text-gold font-semibold text-base">${room.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {room.description}
              </p>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-semibold text-navy dark:text-cream mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <span key={a}
                      className="bg-gold/10 text-navy dark:text-gold text-sm px-3 py-1.5
                        rounded-full border border-gold/20">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              {user ? (
                <>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setShowBooking(!showBooking)}
                      className="flex-1 bg-navy text-gold border border-gold py-3 rounded-xl
                        font-semibold hover:bg-gold hover:text-navy transition"
                    >
                      {showBooking ? "Close Booking Form" : "Book Now"}
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`px-4 py-3 rounded-xl border font-semibold text-sm transition
                        ${isWishlisted
                          ? "bg-gold/20 border-gold text-navy dark:text-gold"
                          : "border-navy/20 dark:border-gold/20 text-navy dark:text-cream hover:border-gold"}`}
                    >
                      {isWishlisted ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>

                  {/* Booking Form */}
                  {showBooking && (
                    <form onSubmit={handleBooking}
                      className="mt-2 p-5 bg-gold/5 dark:bg-gold/10 rounded-xl
                        border border-gold/20">
                      <h3 className="font-semibold text-navy dark:text-cream mb-4">
                        Book This Room
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            min={today}
                            value={booking.date}
                            onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                            className="w-full border border-navy/20 dark:border-gold/20 rounded-lg
                              px-3 py-2 text-sm outline-none bg-white dark:bg-navy-dark
                              text-navy dark:text-cream focus:border-gold transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                            Start Time
                          </label>
                          <select
                            value={booking.startTime}
                            onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                            className="w-full border border-navy/20 dark:border-gold/20 rounded-lg
                              px-3 py-2 text-sm outline-none bg-white dark:bg-navy-dark
                              text-navy dark:text-cream focus:border-gold transition"
                          >
                            {TIME_SLOTS.slice(0, -1).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                            End Time
                          </label>
                          <select
                            value={booking.endTime}
                            onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                            className="w-full border border-navy/20 dark:border-gold/20 rounded-lg
                              px-3 py-2 text-sm outline-none bg-white dark:bg-navy-dark
                              text-navy dark:text-cream focus:border-gold transition"
                          >
                            {TIME_SLOTS.slice(1).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                            Total Cost
                          </label>
                          <div className="w-full border border-gold/20 bg-gold/10 rounded-lg
                            px-3 py-2 text-sm text-gold font-semibold">
                            ${totalCost()}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                          Special Note (optional)
                        </label>
                        <textarea
                          value={booking.specialNote}
                          onChange={(e) => setBooking({ ...booking, specialNote: e.target.value })}
                          rows={2}
                          placeholder="Any special requirements..."
                          className="w-full border border-navy/20 dark:border-gold/20 rounded-lg
                            px-3 py-2 text-sm outline-none bg-white dark:bg-navy-dark
                            text-navy dark:text-cream focus:border-gold transition resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full bg-navy text-gold border border-gold py-3 rounded-xl
                          font-semibold hover:bg-gold hover:text-navy transition disabled:opacity-50
                          flex items-center justify-center gap-2"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Confirming...
                          </>
                        ) : "Confirm Booking"}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-navy text-gold border border-gold
                    py-3 rounded-xl font-semibold hover:bg-gold hover:text-navy transition"
                >
                  Login to Book
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}