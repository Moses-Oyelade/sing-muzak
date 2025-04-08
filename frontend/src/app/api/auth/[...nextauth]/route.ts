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

          if (data) {
            return {
              id: data.user._id,
              phone: data.user.phone,
              name: data.user.name,
              token: data.token,
              role: data.user.role,
            };
          }
          return null;
        } catch (error) {
          console.error("Error logging in", error);
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
    async jwt({ token, user } : any) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.token = user.token; // Store token in JWT
      }
      return token;
    },
    async session({ session, token } : any) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.name = token.name;
      session.user.token = token.token; // Add token to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
