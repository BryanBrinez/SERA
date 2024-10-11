import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const authOptions = {
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

            console.log('User Data:', userData.primerNombre); 

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              rol: userData.rol, 
              primerNombre: userData.primerNombre, 
              token,
            };
          }
        } catch (error) {
          console.error('Error authenticating with Firebase:', error);
          throw new Error("Verifique sus credenciales");;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.rol = user.rol; 
        token.primerNombre = user.primerNombre; 
      }
      console.log('JWT Token:', token); // Depuración
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.user.rol = token.rol;
      session.user.primerNombre = token.primerNombre;
      console.log('Session:', session); // Depuración
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
