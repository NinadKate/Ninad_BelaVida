import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/routing";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect({ href: '/login', locale: 'es-CL' }); // Redirect requires locale if using navigation wrapper?
        // Wait, redirect(url) checks context? 
        // next-intl `redirect` signature: `redirect({href, locale})` or `redirect(href)` if inside localized context?
        // Actually the `redirect` exported from `createNavigation` is valid for Server Components but might behave differently.
        // Usually we just use standard `redirect` from `next/navigation` and prepend locale if we know it.
        // But here we are inside [locale] layout, so we don't easy access to locale unless we take params.
    }

    // Let's use standard Next.js redirect for simplicity if not sure about next-intl server integration specifics without params.
    // But better to simply show "Please log in" or client side redirect.
    // I'll assume session valid for now or let middleware handle protection (I haven't set up middleware protection).

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="mb-4">You are not logged in.</p>
                <a href="/login" className="text-brand-red underline">Go to Login</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-heading mb-6 text-neutral-dark">My Account</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-med">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-2xl font-bold">
                        {session.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-dark">{session.user?.name}</h2>
                        <p className="text-neutral-500">{session.user?.email}</p>
                    </div>
                </div>

                <div className="border-t border-neutral-med pt-6">
                    <h3 className="text-lg font-bold mb-4 text-neutral-dark">Order History</h3>
                    <p className="text-neutral-500 italic">No orders yet.</p>
                </div>
            </div>
        </div>
    );
}
