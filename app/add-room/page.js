"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/api/axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const AMENITIES = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const PRESET_ROOMS = [
  {
    name: "Silent Study Pod",
    description: "Compact silent room ideal for focused solo study and exam preparation.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
    floor: "1st Floor",
    capacity: 2,
    hourlyRate: 4,
    amenities: ["Wi-Fi", "Quiet Zone", "Power Outlets"],
  },
  {
    name: "Collaborative Learning Room",
    description: "Perfect for group assignments with discussion-friendly seating.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    floor: "2nd Floor",
    capacity: 6,
    hourlyRate: 8,
    amenities: ["Whiteboard", "Wi-Fi", "Power Outlets", "Air Conditioning"],
  },
  {
    name: "Research Scholars Hub",
    description: "Quiet study room designed for long research sessions and writing.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    floor: "3rd Floor",
    capacity: 3,
    hourlyRate: 7,
    amenities: ["Wi-Fi", "Quiet Zone", "Air Conditioning"],
  },
  {
    name: "Presentation Practice Room",
    description: "Practice presentations with projector support and spacious seating.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    floor: "2nd Floor",
    capacity: 8,
    hourlyRate: 10,
    amenities: ["Projector", "Whiteboard", "Wi-Fi", "Power Outlets"],
  },
  {
    name: "Graduate Study Lounge",
    description: "Comfortable room for postgraduate students and focused teamwork.",
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800",
    floor: "4th Floor",
    capacity: 5,
    hourlyRate: 9,
    amenities: ["Quiet Zone", "Wi-Fi", "Air Conditioning"],
  },
  {
    name: "Tech-Enabled Study Room",
    description: "Modern room equipped for digital learning and collaboration.",
    image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800",
    floor: "5th Floor",
    capacity: 7,
    hourlyRate: 11,
    amenities: ["Projector", "Wi-Fi", "Power Outlets", "Air Conditioning"],
  },
  {
    name: "Executive Private Study Suite",
    description: "Premium private study suite for uninterrupted focus and research.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    floor: "6th Floor",
    capacity: 1,
    hourlyRate: 18,
    amenities: ["Quiet Zone", "Wi-Fi", "Air Conditioning", "Power Outlets", "Whiteboard"],
  },
  {
    name: "Custom Room",
    description: "",
    image: "",
    floor: "",
    capacity: "",
    hourlyRate: "",
    amenities: [],
  },
];

export default function AddRoom() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "StudyNook – Add Room";
  }, []);

  const imageValue = watch("image");

  useEffect(() => {
    if (imageValue && imageValue.startsWith("http")) {
      setPreviewImage(imageValue);
    } else {
      setPreviewImage("");
    }
  }, [imageValue]);

  const handlePresetChange = (e) => {
    const name = e.target.value;
    setSelectedPreset(name);
    const preset = PRESET_ROOMS.find((r) => r.name === name);
    if (!preset) return;
    setValue("name", preset.name === "Custom Room" ? "" : preset.name);
    setValue("description", preset.description);
    setValue("image", preset.image);
    setValue("floor", preset.floor);
    setValue("capacity", preset.capacity);
    setValue("hourlyRate", preset.hourlyRate);
    setSelectedAmenities(preset.amenities);
    setPreviewImage(preset.image);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/rooms", {
        ...data,
        amenities: selectedAmenities,
        capacity: Number(data.capacity),
        hourlyRate: Number(data.hourlyRate),
      });
      toast.success("Room added to library successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add room");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
        <Navbar />
        <main className="flex-1 py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy dark:text-cream mb-1">
              Add a Study Room to the Library {/* ← updated heading */}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Register a new study room so students can discover and book it
            </p>

            <div className="bg-white dark:bg-navy/30 rounded-2xl border border-navy/8 dark:border-gold/15 p-6 shadow-sm">

              {/* Preset Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy dark:text-cream mb-2">
                  Quick Select a Room Template
                </label>
                <select
                  value={selectedPreset}
                  onChange={handlePresetChange}
                  className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-3 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                >
                  <option value="">-- Select a room template --</option>
                  {PRESET_ROOMS.map((r) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Select a template to auto-fill fields, then customize as needed
                </p>
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6 border border-gold/20">
                  <Image
                    src={previewImage}
                    alt="Room preview"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium bg-navy/60 px-2 py-1 rounded-full">
                    Preview
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Room Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Room name is required" })}
                    className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                    placeholder="e.g. Quiet Study Room A"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Description</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    rows={3}
                    className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition resize-none"
                    placeholder="Describe the study room..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Image URL</label>
                  <input
                    type="text"
                    {...register("image", { required: "Image URL is required" })}
                    className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                    placeholder="https://example.com/room.jpg"
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Floor</label>
                    <input
                      type="text"
                      {...register("floor", { required: "Floor is required" })}
                      className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                      placeholder="e.g. 2nd Floor"
                    />
                    {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Capacity</label>
                    <input
                      type="number"
                      {...register("capacity", { required: "Capacity is required", min: { value: 1, message: "Min 1" } })}
                      className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                      placeholder="e.g. 4"
                    />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    {...register("hourlyRate", { required: "Hourly rate is required", min: { value: 1, message: "Min $1" } })}
                    className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5 text-sm outline-none bg-cream dark:bg-navy-dark text-navy dark:text-cream focus:border-gold transition"
                    placeholder="e.g. 5"
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy dark:text-cream mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-navy/5 dark:hover:bg-gold/5 transition">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy text-gold border border-gold py-3 rounded-xl
                    font-semibold hover:bg-gold hover:text-navy transition disabled:opacity-50
                    flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Adding Room...
                    </>
                  ) : "Add Room to Library"}
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