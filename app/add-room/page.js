"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
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

export default function AddRoom() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "StudyNook – Add Room";
  }, []);

  const onSubmit = async (data) => {
    try {
      const amenities = AMENITIES.filter((a) => data.amenities?.includes(a));
      const payload = {
        ...data,
        amenities,
        capacity: Number(data.capacity),
        hourlyRate: Number(data.hourlyRate),
      };
      await api.post("/rooms", payload);
      toast.success("Room added successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add room");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a Study Room</h1>
            <p className="text-gray-500 text-sm mb-8">Fill in the details to list your room</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Room Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Room name is required" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                    placeholder="e.g. Quiet Study Room A"
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
                    placeholder="Describe your study room..."
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
                    placeholder="https://example.com/room.jpg"
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
                      placeholder="e.g. 2nd Floor"
                    />
                    {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      {...register("capacity", { required: "Capacity is required", min: { value: 1, message: "Min 1" } })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                      placeholder="e.g. 4"
                    />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    {...register("hourlyRate", { required: "Hourly rate is required", min: { value: 1, message: "Min $1" } })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                    placeholder="e.g. 5"
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
                          value={amenity}
                          {...register("amenities")}
                          className="accent-emerald-600"
                        />
                        <span className="text-sm text-gray-600">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Adding Room..." : "Add Room"}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}