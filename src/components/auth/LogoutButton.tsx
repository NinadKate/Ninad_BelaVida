"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-med rounded-lg text-neutral-600 hover:text-brand-red hover:border-brand-red hover:bg-red-50 transition-all font-medium"
        >
            <LogOut size={18} />
            <span>Sign Out</span>
        </button>
    );
}
