"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import api from "@/api/axios";
import toast from "react-hot-toast";

const AMENITIES = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function EditRoom() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "StudyNook – Edit Room";
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      const room = res.data.data;
      setValue("name", room.name);
      setValue("description", room.description);
      setValue("image", room.image);
      setValue("floor", room.floor);
      setValue("capacity", room.capacity);
      setValue("hourlyRate", room.hourlyRate);
      setSelectedAmenities(room.amenities);
    } catch (err) {
      toast.error("Failed to load room");
      router.push("/my-listings");
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

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amenities: selectedAmenities,
        capacity: Number(data.capacity),
        hourlyRate: Number(data.hourlyRate),
      };
      await api.put(`/rooms/${id}`, payload);
      toast.success("Room updated successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
      <Footer />
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Room</h1>
            <p className="text-gray-500 text-sm mb-8">Update your study room details</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Room Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Room name is required" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    {...register("image", { required: "Image URL is required" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>

                {/* Floor & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                    <input
                      type="text"
                      {...register("floor", { required: "Floor is required" })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                    />
                    {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      {...register("capacity", { required: "Capacity is required" })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                    />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    {...register("hourlyRate", { required: "Hourly rate is required" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate.message}</p>}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
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

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/my-listings")}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Update Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}