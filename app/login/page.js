"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import api from "@/api/axios";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    document.title = "StudyNook – Login";
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/users/login", {
        email: data.email,
        password: data.password,
      });
      const res = await api.get("/users/me");
      setUser(res.data.data);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = process.env.NODE_ENV === "production"
    ? "https://studynook-server-yxr0.onrender.com/api/users/auth/google"
    : "http://localhost:5000/api/users/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white dark:bg-navy/40 rounded-2xl shadow-sm
          border border-gray-200 dark:border-gold/15 p-8 w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy dark:text-cream">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Login to your StudyNook account
            </p>
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="w-full border border-gray-300 dark:border-gold/20 rounded-xl px-4 py-2.5
                  text-sm outline-none bg-white dark:bg-navy-dark
                  text-navy dark:text-cream focus:border-gold transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy dark:text-cream mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-gold/20 rounded-xl px-4 py-2.5
                  text-sm outline-none bg-white dark:bg-navy-dark
                  text-navy dark:text-cream focus:border-gold transition"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
                  Logging in...
                </>
              ) : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}