import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const authOptions = {
    adapter: DrizzleAdapter(db),
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
    session: {
        strategy: "jwt" as const
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role
                (session.user as any).id = token.id
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions as AuthOptions)

export { handler as GET, handler as POST }
