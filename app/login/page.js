"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/api/axios";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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
    window.location.href = "http://localhost:5000/api/users/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-navy-dark">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Login to your StudyNook account
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-4"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="w-full border rounded-xl px-4 py-2.5 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}

            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-2.5 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}