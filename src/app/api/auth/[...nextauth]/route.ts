import NextAuth, { AuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Validate required environment variables for production auth
if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXTAUTH_URL) {
        console.error("❌ MISSING: NEXTAUTH_URL must be set in production (e.g., https://bellavida.cl)");
    }
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error("❌ MISSING: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }
    if (!process.env.NEXTAUTH_SECRET) {
        console.error("❌ MISSING: NEXTAUTH_SECRET must be set (generate with: openssl rand -base64 32)");
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // Simple mock implementation or check DB if users seeded with passwords
                if (!credentials?.email || !credentials.password) return null;

                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email)
                });

                // In real app, check password hash. For now, if user exists, return it.
                if (user) {
                    return {
                        ...user,
                        role: user.role as "user" | "admin"
                    }
                }
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    // Production domain configuration
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    session: {
        strategy: "jwt" as const
    },
    callbacks: {
        async signIn({ user, account }: { user: any; account: any }) {
            if (account?.provider === "google") {
                if (!user.email) return false;

                const existingUser = await db.query.users.findFirst({
                    where: eq(users.email, user.email)
                });

                if (!existingUser) {
                    await db.insert(users).values({
                        id: crypto.randomUUID(),
                        name: user.name || "Google User",
                        email: user.email,
                        image: user.image,
                        role: "user"
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            if (user) {
                if (account?.provider === "google") {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.email, user.email!)
                    });
                    if (dbUser) {
                        token.userRole = dbUser.role;
                        token.userId = dbUser.id;
                    }
                } else {
                    token.userRole = user.role;
                    token.userId = user.id;
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: any }) {
            if (session.user) {
                (session.user as any).role = token.userRole;
                (session.user as any).id = token.userId;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

// Production troubleshooting checklist:
// 1. Set NEXTAUTH_URL to your production domain (e.g., https://bellavida.cl)
// 2. Set NEXTAUTH_SECRET (run: openssl rand -base64 32)
// 3. In Google Cloud Console:
//    - Go to APIs & Services > Credentials
//    - Find your OAuth 2.0 Client ID
//    - Under "Authorized redirect URIs", add: {NEXTAUTH_URL}/api/auth/callback/google
//    - Example: https://bellavida.cl/api/auth/callback/google
// 4. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

const handler = NextAuth(authOptions as AuthOptions)

export { handler as GET, handler as POST }
