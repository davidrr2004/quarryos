"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sans">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-600 font-sans">
            Sign in to your QuarryOS account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-5 p-3 bg-red-50 border border-red-200"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              borderRadius: "var(--radius-selector)",
            }}
          >
            <p className="text-sm text-red-700 font-sans">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-900 mb-2 font-sans"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-200 text-sm font-sans text-slate-900 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "var(--radius-field)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-900 mb-2 font-sans"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 text-sm font-sans text-slate-900 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "var(--radius-field)",
              }}
            />
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-xs font-semibold transition-colors font-sans"
              style={{ color: "var(--color-primary)" }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold text-sm transition-all shadow-soft hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed font-sans"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: "var(--shadow-soft)",
              borderRadius: "var(--radius-field)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <p className="px-3 text-xs text-slate-500 font-sans">Or continue with</p>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center py-3 border border-slate-200 bg-white text-slate-900 font-sans text-sm font-semibold transition-all hover:bg-slate-50"
            style={{
              boxShadow: "var(--shadow-soft)",
              borderRadius: "var(--radius-field)",
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <button
            className="flex items-center justify-center py-3 border border-slate-200 bg-white text-slate-900 font-sans text-sm font-semibold transition-all hover:bg-slate-50"
            style={{
              boxShadow: "var(--shadow-soft)",
              borderRadius: "var(--radius-field)",
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.05 13.5c-.91 2.92-3.44 4.77-6.17 4.77-2.29 0-4.55-1.31-5.48-3.3-.19-.49-.31-1.01-.31-1.55 0-3.03 2.29-5.5 5.12-5.5 1.12 0 2.19.35 3.08.95.89-.6 1.96-.95 3.08-.95 2.83 0 5.12 2.47 5.12 5.5 0 .54-.12 1.06-.31 1.55-.93 1.99-3.19 3.3-5.48 3.3zm-1.05-11.44c1.1 0 2-1.12 2-2.5S17.1 0 16 0c-1.1 0-2 1.12-2 2.5s.9 2.56 2 2.56zm-7.39 0c1.1 0 2-1.12 2-2.5S9.71 0 8.61 0c-1.1 0-2 1.12-2 2.5s.9 2.56 2 2.56z" />
            </svg>
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}
