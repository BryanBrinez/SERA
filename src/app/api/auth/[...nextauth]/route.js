import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
            const userRef = doc(db, "users", userCredential.user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();

            
            if (!userData || !userData.rol) {
              throw new Error('User role not found');
            }

            console.log('User Data:', userData); 

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email, // Cambia 'correo' a 'email' si es el campo correcto
              rol: userData.rol, // Obtén el rol desde Firestore
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
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.rol = user.rol; // Añade el rol al token
      }
      console.log('JWT Token:', token); // Depuración
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.user.rol = token.rol; // Añade el rol a la sesión
      console.log('Session:', session); // Depuración
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
