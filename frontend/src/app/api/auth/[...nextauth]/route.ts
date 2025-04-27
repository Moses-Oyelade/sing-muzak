// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions : NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Send login request to your backend
          const { data } = await axios.post("http://localhost:3000/auth/login", {
            phone: credentials?.phone,
            password: credentials?.password,
          });

          console.log("🚀 Auth response:", data);

          // if (data && data.token && data.user) {
          if (data?.access_token && data?.user) {
            return {
              id: data.user._id,
              phone: data.user.phone,
              name: data.user.name,
              role: data.user.role,
              token: data.access_token,
            };
          }
          return null;
        } catch (error: unknown ) {
          if (axios.isAxiosError(error)) {
            console.error("❌ Login error in authorize():", error?.response?.data || error.message);
          } else {
            console.error("Error logging in", error);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom login page
    error: "/auth/error", // Custom error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.role = user.role;
        token.token = user.token; // Store token in JWT
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          phone: token.phone,
          role: token.role,
          token: token.token, // ✅ This is the JWT you need
        },
      };
    }
    
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
