"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/api/axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#1e3a5f" />
        <path d="M8 26V12l10-4 10 4v14" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
        <rect x="14" y="18" width="8" height="8" rx="1" fill="#c9a84c" opacity="0.9" />
        <path d="M10 14h16M10 18h4M22 18h4" stroke="#c9a84c" strokeWidth="1.2" opacity="0.6" />
      </svg>
      <div>
        <div className="font-display text-lg font-bold leading-none text-navy dark:text-cream">
          StudyNook
        </div>
        <div className="text-xs leading-none text-gold tracking-widest mt-0.5">
          UNIVERSITY LIBRARY
        </div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all
        bg-navy/8 dark:bg-gold/10 text-navy dark:text-gold
        hover:bg-navy/15 dark:hover:bg-gold/20"
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

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
      <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark transition-colors duration-300">

        {/* Top bar with logo and theme toggle */}
        <div className="max-w-2xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <main className="flex-1 py-8 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy dark:text-cream mb-1">
              My Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              View and update your student information. Keep your academic level up to date for a personalised experience.
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
                    font-semibold hover:bg-gold hover:text-navy dark:hover:text-navy transition"
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
                      className="flex-1 border border-gray-300 dark:border-white/20
                        text-gray-600 dark:text-gray-400 py-3 rounded-xl
                        font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-navy dark:bg-gold text-gold dark:text-navy border border-gold
                        py-3 rounded-xl font-semibold hover:bg-gold hover:text-navy
                        dark:hover:bg-navy dark:hover:text-gold transition disabled:opacity-50
                        flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <Link href="/" className="text-gold font-medium hover:underline">
                ← Back to Home
              </Link>
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}