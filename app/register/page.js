"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical & Electronic Engineering",
  "Business Administration",
  "Economics",
  "English",
  "Law",
  "Pharmacy",
  "Civil Engineering",
  "Architecture",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Other",
];

const ACADEMIC_LEVELS = [
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
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 justify-center no-underline mb-6">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#1e3a5f"/>
        <path d="M8 26V12l10-4 10 4v14" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
        <rect x="14" y="18" width="8" height="8" rx="1" fill="#c9a84c" opacity="0.9"/>
        <path d="M10 14h16M10 18h4M22 18h4" stroke="#c9a84c" strokeWidth="1.2" opacity="0.6"/>
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
      className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center transition-all
        bg-navy/8 dark:bg-gold/10 text-navy dark:text-gold
        hover:bg-navy/15 dark:hover:bg-gold/20"
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();

  useEffect(() => {
    document.title = "StudyNook – Register";
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/users/register", data);
      if (res.data.success) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/auth/google";
  };

  const inputClass = `w-full border border-gray-300 dark:border-gold/20 rounded-xl px-4 py-2.5
    text-sm outline-none bg-white dark:bg-navy-dark
    text-navy dark:text-cream focus:border-gold transition`;

  const labelClass = "block text-sm font-medium text-navy dark:text-cream mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
      bg-cream dark:bg-navy-dark transition-colors duration-300">

      <div className="relative bg-white dark:bg-navy/40 rounded-2xl shadow-sm
        border border-gray-200 dark:border-gold/15 p-8 w-full max-w-md">

        <ThemeToggle />
        <Logo />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-navy dark:text-cream">Create account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join StudyNook today</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300
            dark:border-gold/20 rounded-xl px-4 py-3 text-sm font-medium
            text-gray-700 dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-gold/5 transition mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={inputClass}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Student ID */}
          <div>
            <label className={labelClass}>Student ID</label>
            <input
              type="text"
              {...register("studentId", { required: "Student ID is required" })}
              className={inputClass}
              placeholder="e.g. 2021-1-60-001"
            />
            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className={labelClass}>Department</label>
            <select
              {...register("department", { required: "Department is required" })}
              className={inputClass}
            >
              <option value="">-- Select Department --</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
          </div>

          {/* Academic Level */}
          <div>
            <label className={labelClass}>Academic Level</label>
            <select
              {...register("academicLevel", { required: "Academic level is required" })}
              className={inputClass}
            >
              <option value="">-- Select Academic Level --</option>
              {ACADEMIC_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.academicLevel && <p className="text-red-500 text-xs mt-1">{errors.academicLevel.message}</p>}
          </div>

          {/* Photo URL */}
          <div>
            <label className={labelClass}>
              Photo URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              {...register("image")}
              className={inputClass}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
                validate: {
                  hasUppercase: (v) => /[A-Z]/.test(v) || "Must have at least one uppercase letter",
                  hasLowercase: (v) => /[a-z]/.test(v) || "Must have at least one lowercase letter",
                },
              })}
              className={inputClass}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Min 6 chars, one uppercase, one lowercase</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-navy dark:bg-gold text-gold dark:text-navy border border-gold
              py-3 rounded-xl font-semibold hover:bg-gold hover:text-navy
              dark:hover:bg-navy dark:hover:text-gold transition disabled:opacity-50
              flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}