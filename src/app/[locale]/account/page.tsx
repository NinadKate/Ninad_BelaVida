import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AccountPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations('Account');
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`/${locale}/login`);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-heading mb-6 text-neutral-dark">{t('title')}</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-med">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green text-2xl font-bold">
                        {session.user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-neutral-dark">{session.user?.name}</h2>
                        <p className="text-neutral-500">{session.user?.email}</p>
                    </div>
                    {/* Admin Link Check */}
                    <div className="flex flex-col gap-2">
                        <AdminLink email={session.user?.email} />
                        <LogoutButton />
                    </div>
                </div>

                <div className="border-t border-neutral-med pt-6">
                    <h3 className="text-lg font-bold mb-4 text-neutral-dark">{t('orderHistory')}</h3>
                    <p className="text-neutral-500 italic">{t('noOrders')}</p>
                </div>
            </div>
        </div>
    );
}

async function AdminLink({ email }: { email?: string | null }) {
    if (!email) return null;
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (user?.role === 'admin') {
        return (
            <Link href="/admin" className="btn-premium bg-neutral-dark text-white hover:bg-black">
                Admin Dashboard
            </Link>
        );
    }
    return null;
}
