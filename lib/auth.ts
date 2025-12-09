import { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { client } from "@/sanity/lib/client"

// Create a write client for creating users
const writeClient = client.withConfig({
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
})

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Agency Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Auth Attempt:", credentials)
                if (!credentials?.username || !credentials?.password) return null

                const username = credentials.username.trim()
                const password = credentials.password

                // Fetch user from Sanity (Case-insensitive username check)
                try {
                    const user = await client.fetch(
                        `*[_type == "user" && lower(username) == lower($username)][0]`,
                        { username }
                    )
                    console.log("User Found:", user)

                    if (user && user.password === password) {
                        return {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        }
                    } else if (user) {
                        console.warn("Password mismatch for user:", username)
                    } else {
                        console.warn("User not found:", username)
                    }
                } catch (error) {
                    console.error("Auth Error:", error)
                }
                return null
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            // Check if user exists
            try {
                const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, {
                    email: user.email,
                });

                if (!existingUser) {
                    // Create new advertiser using WRITE CLIENT
                    console.log("Creating new user in Sanity:", user.email)
                    await writeClient.create({
                        _type: 'user',
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: 'advertiser',
                    });
                }
            } catch (error) {
                console.error("SignIn Error", error)
                return true
            }

            return true;
        },
        async session({ session, token }) {
            const email = session.user?.email
            // @ts-ignore
            const username = token.name // Or rely on email being present for Agencies too.

            if (email) {
                // Fetch extended details
                try {
                    const sanityUser = await client.fetch(
                        `*[_type == "user" && (email == $email || username == $email)][0]{role, phone, agencyProfile}`,
                        { email }
                    );

                    if (sanityUser) {
                        // @ts-ignore
                        session.user.role = sanityUser.role;
                        // @ts-ignore
                        session.user.phone = sanityUser.phone;
                        // @ts-ignore
                        session.user.agencyProfile = sanityUser.agencyProfile;
                    }
                } catch (error) {
                    console.error("Session Fetch Error", error)
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
