import NextAuth, {
  Account,
  NextAuthConfig,
  Profile,
  Session,
  User,
} from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";
import { SignInOptions } from "next-auth/react";

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
        console.log(existingGuest);
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
      console.log({ session });
      console.log({ user });
      const guest = await getUser(session.user!.email!);

      // session.user.guestId = guest.id;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);

/*
import NextAuth, { Account, NextAuthConfig, Profile, Session, User } from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";
import { SignInOptions } from "next-auth/react";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile: Profile | null }) {
      try {
        const existingGuest = await getUser(user.email!);

        if (!existingGuest) {
          await createUser({
            email: user.email!,
            name: user.name || "Unknown", // Ensure name is set properly
          });
        }

        return true; // Return true if sign-in succeeds
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Return false if sign-in fails
      }
    },

    async session({ session, user }: { session: Session; user: User }) {
      const guest = await getUser(user.email!);

      if (guest) {
        session.user.guestId = guest.id;
      }

      return session;
    },

    authorized({ auth }: { auth: SignInOptions }) {
      return !!auth?.user;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);
*/
