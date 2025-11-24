"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/config";
import { saveAuthSession } from "@/lib/utils/storage";
import { resolveDashboardRoute } from "@/lib/utils/routing";
import { getIdTokenFromCustomToken } from "@/lib/firebase/auth";

const highlights = [
  "Single sign-on ready",
  "Field-level validations",
  "Uploads live previews",
];

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1: Login to backend API to get custom token
      const response = await login({ email, password });
      
      // Step 2: Sign in with Firebase using custom token and get ID token
      const idToken = await getIdTokenFromCustomToken(response.token);
      
      // Step 3: Save the Firebase ID token (this is the real access token for APIs)
      saveAuthSession(idToken, response.user, rememberMe);
      
      // Step 4: Redirect to appropriate dashboard
      router.replace(resolveDashboardRoute(response.user?.role ?? response.role));
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message || "Unable to authenticate. Please verify your credentials.");
      } else {
        setError("Something went wrong while signing in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500 shadow-sm">
            Logic Access
          </div>
          <Image
            src="/brand/coverscrafter-logo.png"
            alt="CoversCrafter logo"
            width={260}
            height={112}
            priority
          />
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              CoversCrafter Admin Console
            </h1>
          </div>
          <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-orange-400 text-xs font-semibold text-white">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          <header className="mb-8 space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-600">
              Secure Login
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Enter your admin credentials
            </h2>
            <p className="text-sm text-slate-500">
              Sign in to access the CoversCrafter administrative dashboard.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@coverscrafter.com"
                required
                autoComplete="email"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                  disabled={isSubmitting}
                />
                Keep me signed in
              </label>
              <button type="button" className="text-blue-600 underline-offset-4 hover:underline">
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-orange-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isSubmitting ? "Signing in..." : "Continue to Dashboard"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in you agree to the CoversCrafter admin terms & security
            policy.
          </p>
        </section>
      </div>
    </div>
  );
}
