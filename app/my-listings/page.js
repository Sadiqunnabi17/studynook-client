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
import { useRouter } from "next/navigation";

export default function MyListings() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const router = useRouter();

  useEffect(() => {
    document.title = "StudyNook – My Listings";
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const res = await api.get("/rooms/my-rooms");
      setRooms(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch your rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted successfully");
      setRooms((prev) => prev.filter((r) => r._id !== id));
      setDeleteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
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
                  Manage your study rooms
                </p>
              </div>
              <Link href="/add-room"
                className="bg-navy text-gold border border-gold px-4 py-2 rounded-xl
                  text-sm font-semibold hover:bg-gold hover:text-navy transition">
                + Add Room
              </Link>
            </div>

            {loading ? <Spinner /> : rooms.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-navy/30 rounded-2xl
                border border-navy/8 dark:border-gold/15">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-navy dark:text-cream mb-2">
                  No rooms listed yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Start earning by listing your study room
                </p>
                <Link href="/add-room"
                  className="bg-navy text-gold border border-gold px-6 py-2.5 rounded-xl
                    text-sm font-semibold hover:bg-gold hover:text-navy transition">
                  Add Your First Room
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => (
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
                        {room.bookingCount} bookings
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
                          className="flex-1 text-center border border-navy/20 dark:border-gold/20
                            text-navy dark:text-cream py-2 rounded-lg text-sm font-medium
                            hover:bg-navy/5 dark:hover:bg-gold/5 transition">
                          View
                        </Link>
                        <Link href={`/rooms/${room._id}/edit`}
                          className="flex-1 text-center border border-gold text-gold py-2
                            rounded-lg text-sm font-medium hover:bg-gold hover:text-navy transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal(room)}
                          className="flex-1 border border-red-400 text-red-500 py-2 rounded-lg
                            text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-navy-dark rounded-2xl p-6 max-w-sm w-full
              border border-navy/10 dark:border-gold/20">
              <h3 className="text-lg font-bold text-navy dark:text-cream mb-2">Delete Room</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Are you sure you want to delete <strong>{deleteModal.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 border border-navy/20 dark:border-gold/20 text-navy dark:text-cream
                    py-2.5 rounded-xl font-medium hover:bg-navy/5 dark:hover:bg-gold/5 transition">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium
                    hover:bg-red-600 transition">
                  Delete
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