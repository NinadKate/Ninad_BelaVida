import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
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
                    return user
                }
                return null
            }
        })
    ],
    session: {
        strategy: "jwt" as const
    },
    pages: {
        signIn: '/login',
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
