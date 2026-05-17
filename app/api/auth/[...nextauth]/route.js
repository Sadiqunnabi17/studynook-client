import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/users/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          const user = res.data.data.user;
          if (user) return user;
          return null;
        } catch (err) {
          throw new Error(
            err.response?.data?.message || "Invalid credentials"
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.image = user.image;
      }
      if (account?.provider === "google") {
        token.provider = "google";
        // Save Google user to backend
        try {
          const res = await axios.post(
            "http://localhost:5000/api/users/google",
            {
              name: token.name,
              email: token.email,
              image: token.picture,
            }
          );
          token.id = res.data.data.user.id;
          token.role = res.data.data.user.role;
          token.image = res.data.data.user.image;
        } catch (err) {
          console.error("Google auth error:", err.message);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.image = token.image || session.user.image;
      session.user.provider = token.provider;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };