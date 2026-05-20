"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/api/axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "StudyNook – My Profile";
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        academicLevel: user.academicLevel || "",
        image: user.image || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await api.patch("/users/profile", {
        academicLevel: data.academicLevel,
        image: data.image,
      });
      setUser(res.data.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
        <Navbar />
        <main className="flex-1 py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy dark:text-cream mb-1">
              My Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              View and update your student information
            </p>

            <div className="bg-white dark:bg-navy/30 rounded-2xl border border-navy/8 dark:border-gold/15 p-6 shadow-sm">

              {/* Avatar & Name */}
              <div className="flex items-center gap-5 mb-8">
                {user?.image && user.image.startsWith("http") ? (
                  <Image
                    src={user.image}
                    alt={user?.name || "User"}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-gold object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-navy border-4 border-gold
                    flex items-center justify-center text-gold font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-navy dark:text-cream">{user?.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs font-medium bg-gold/20 text-navy dark:text-gold px-2 py-0.5 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-1 gap-4 mb-8">

                <div className="bg-cream dark:bg-navy-dark rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Student ID</p>
                  <p className="text-sm font-medium text-navy dark:text-cream">
                    {user?.studentId || "—"}
                  </p>
                </div>

                <div className="bg-cream dark:bg-navy-dark rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Department</p>
                  <p className="text-sm font-medium text-navy dark:text-cream">
                    {user?.department || "—"}
                  </p>
                </div>

                <div className="bg-cream dark:bg-navy-dark rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Academic Level</p>
                  <p className="text-sm font-medium text-navy dark:text-cream">
                    {user?.academicLevel || "—"}
                  </p>
                </div>

                <div className="bg-cream dark:bg-navy-dark rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Member Since</p>
                  <p className="text-sm font-medium text-navy dark:text-cream">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

              </div>

              {/* Edit Section */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full border border-gold text-navy dark:text-gold py-3 rounded-xl
                    font-semibold hover:bg-gold hover:text-navy transition"
                >
                  Edit Profile
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h3 className="text-sm font-semibold text-navy dark:text-cream">
                    Update Profile
                  </h3>

                  {/* Academic Level */}
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                      Academic Level
                    </label>
                    <select
                      {...register("academicLevel", { required: "Academic level is required" })}
                      className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5
                        text-sm outline-none bg-cream dark:bg-navy-dark
                        text-navy dark:text-cream focus:border-gold transition"
                    >
                      <option value="">-- Select Academic Level --</option>
                      {[
                        "1st Year 1st Semester",
                        "1st Year 2nd Semester",
                        "2nd Year 1st Semester",
                        "2nd Year 2nd Semester",
                        "3rd Year 1st Semester",
                        "3rd Year 2nd Semester",
                        "4th Year 1st Semester",
                        "4th Year 2nd Semester",
                        "Masters",
                        "PhD",
                      ].map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {errors.academicLevel && (
                      <p className="text-red-500 text-xs mt-1">{errors.academicLevel.message}</p>
                    )}
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                      Photo URL <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register("image")}
                      className="w-full border border-navy/20 dark:border-gold/20 rounded-xl px-4 py-2.5
                        text-sm outline-none bg-cream dark:bg-navy-dark
                        text-navy dark:text-cream focus:border-gold transition"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl
                        font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-navy text-gold border border-gold py-3 rounded-xl
                        font-semibold hover:bg-gold hover:text-navy transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}