"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="fixed inset-0 -z-10 bg-background" />;
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            {/* Animated blobs with diverse vibrant colors */}

            {/* Brand Green */}
            <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-brand-green/30 dark:bg-brand-green-dark/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob" />

            {/* Cyan / Teal */}
            <div
                className="absolute top-1/3 right-1/4 w-[25vw] h-[25vw] min-w-[250px] min-h-[250px] bg-cyan-300/40 dark:bg-teal-900/50 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob"
                style={{ animationDelay: '2s' }}
            />

            {/* Deep Rose / Pink */}
            <div
                className="absolute bottom-1/4 left-1/3 w-[35vw] h-[35vw] min-w-[350px] min-h-[350px] bg-rose-300/40 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob"
                style={{ animationDelay: '4s' }}
            />

            {/* Purple / Violet */}
            <div
                className="absolute top-1/2 left-2/3 w-[20vw] h-[20vw] min-w-[200px] min-h-[200px] bg-purple-300/40 dark:bg-violet-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob"
                style={{ animationDelay: '1s' }}
            />

            {/* Amber / Yellow */}
            <div
                className="absolute -bottom-10 -left-10 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-amber-200/40 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-50 animate-blob"
                style={{ animationDelay: '2s' }}
            />

            {/* Indigo / Blue */}
            <div
                className="absolute -top-10 -right-10 w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-indigo-300/30 dark:bg-blue-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-60 animate-blob"
                style={{ animationDelay: '3s' }}
            />

            {/* Glass overlay covering the entire screen to soften and blur everything further */}
            <div className="absolute inset-0 bg-white/40 dark:bg-neutral-950/60 backdrop-blur-[60px] pointer-events-none" />
        </div>
    );
}
