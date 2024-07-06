import NextAuth, {
  Account,
  AuthError,
  NextAuthConfig,
  Profile,
  Session,
  User,
} from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";
import { SignInOptions } from "next-auth/react";
import toast from "react-hot-toast";
import { getErrorMessage } from "./helper";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ request, auth }: { request: any; auth: Session | null }) {
      return !!auth?.user;
    },

    async signIn({ user }: { user: User }) {
      try {
        const existingGuest = await getUser(user.email!);
        if (!existingGuest) {
          await createUser({
            email: user.email!,
            name: user.name!,
          });
        }

        return true;
      } catch {
        return false;
      }
    },

    async session({ session, user }: { session: Session; user: User }) {
      const guest = await getUser(session.user!.email!);

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export const {
  auth,
  handlers: { GET, POST },

  signOut,
  signIn,
} = NextAuth(authConfig);

