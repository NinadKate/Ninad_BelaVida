"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (result?.error) {
            setError("Login failed. Check your credentials.");
        } else {
            router.push("/");
            router.refresh(); // Refresh to update session state in UI
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-neutral-med">
                <h1 className="text-2xl font-bold font-heading mb-6 text-center text-neutral-dark">Login to your account</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-brand-red text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-dark">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-med focus:ring-2 focus:ring-brand-red focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-dark">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-med focus:ring-2 focus:ring-brand-red focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-brand-red text-white font-bold rounded-full hover:bg-brand-red-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    Don't have an account? <Link href="/register" className="text-brand-red font-bold hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
