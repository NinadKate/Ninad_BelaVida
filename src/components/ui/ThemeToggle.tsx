"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={cn("p-2.5 w-9 h-9 rounded-full", className)} />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 group",
                "hover:bg-neutral-soft dark:hover:bg-white/10",
                className
            )}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Sun icon (light mode) */}
            <Sun
                size={20}
                className={cn(
                    "absolute inset-0 m-auto transition-all duration-300",
                    "text-neutral-dark dark:text-white group-hover:text-brand-green",
                    isDark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                )}
            />
            {/* Moon icon (dark mode) */}
            <Moon
                size={20}
                className={cn(
                    "absolute inset-0 m-auto transition-all duration-300",
                    "text-neutral-dark dark:text-white group-hover:text-brand-green",
                    isDark
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                )}
            />
            {/* Placeholder to maintain size */}
            <span className="w-5 h-5 block" />
        </button>
    );
}
