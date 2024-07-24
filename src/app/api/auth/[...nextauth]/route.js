
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);

          if (userCredential.user) {
            const token = await userCredential.user.getIdToken();
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              token,
            };
          }
        } catch (error) {
          console.error('Error authenticating with Firebase:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      //console.log(token);
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      console.log(session)
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };