import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LogoutButton from "@/components/auth/LogoutButton";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Account");
  const adminOrdersT = await getTranslations("Admin.orders");
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  let userId = (session.user as { id?: string | null })?.id ?? null;
  if (!userId && session.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: { id: true },
    });
    userId = user?.id ?? null;
  }

  const userOrders = userId
    ? await db
        .select({
          id: orders.id,
          status: orders.status,
          total: orders.total,
          currency: orders.currency,
          created_at: orders.created_at,
        })
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.created_at))
    : [];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "received":
        return "bg-purple-100 text-purple-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "on delivery":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-3xl font-bold font-heading mb-5 sm:mb-6 text-neutral-dark dark:text-white">
        {t("title")}
      </h1>
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-neutral-med dark:border-neutral-800">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-green/10 dark:bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green dark:text-brand-green text-2xl font-bold shrink-0">
              {session.user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-dark dark:text-white truncate">
                {session.user?.name}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 break-all">
                {session.user?.email}
              </p>
            </div>
          </div>

          {/* Admin Link Check */}
          <div className="flex w-full sm:w-auto flex-col gap-2">
            <AdminLink email={session.user?.email} />
            <LogoutButton />
          </div>
        </div>

        <div className="border-t border-neutral-med dark:border-neutral-800 pt-6">
          <h3 className="text-lg font-bold mb-4 text-neutral-dark dark:text-white">
            {t("orderHistory")}
          </h3>
          {userOrders.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400 italic">
              {t("noOrders")}
            </p>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-neutral-med dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        #{order.id}
                      </p>
                      <p
                        className="text-sm text-neutral-600 dark:text-neutral-400"
                        suppressHydrationWarning
                      >
                        {order.created_at
                          ? new Intl.DateTimeFormat(locale).format(
                              new Date(order.created_at),
                            )
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${getStatusStyles(order.status)}`}
                      >
                        {adminOrdersT("status")}: {order.status}
                      </span>
                      <p className="text-sm font-bold text-neutral-dark dark:text-white whitespace-nowrap">
                        {adminOrdersT("total")}:{" "}
                        {formatCurrency(
                          order.total,
                          getCurrencyForLocale(locale),
                          locale,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function AdminLink({ email }: { email?: string | null }) {
  if (!email) return null;
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user?.role === "admin") {
    return (
      <Link
        href="/admin"
        className="btn-premium bg-neutral-dark text-white hover:bg-black w-full text-center sm:w-auto"
      >
        Admin Dashboard
      </Link>
    );
  }
  return null;
}