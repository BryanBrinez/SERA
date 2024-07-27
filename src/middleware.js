import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;

    
    if (!token) {
      console.log("No token found");
      
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userId = token.user?.id;

    if (!userId) {
      console.log("User ID not found in token");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // Llamar al endpoint para obtener los datos del usuario
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/${userId}`);
      const data = await res.json();

      if (res.status !== 200) {
        console.log("Error fetching user role. Status code:", res.status);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      const userRoles = data.rol; // Asegúrate de que esto es un array
      if (!userRoles || !Array.isArray(userRoles)) {
        console.log("User roles not found or not an array");
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Verificar acceso general a la ruta /home
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith('/home')) {
        // Si está en /home o subrutas, verifica el rol para subrutas específicas
        const protectedRoutes = {
          "/home/usuarios": ["Admin"],
          "/home": ["Admin", "Coordinador", "Auxiliar", "Profesor"], // Incluye el nuevo rol
        };

        let isAuthorized = false;

        for (const [route, roles] of Object.entries(protectedRoutes)) {
          if (pathname.startsWith(route)) {
            isAuthorized = roles.some(role => userRoles.includes(role));
            if (!isAuthorized) {
              console.log(`User roles ${userRoles} are not authorized for route ${route}`);
            }
            break; // No es necesario seguir verificando otras rutas si ya se encontró la ruta
          }
        }

        if (isAuthorized) {
          console.log("User is authorized");
          return NextResponse.next();
        } else {
          console.log("User is not authorized");
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }

      // Si no es una ruta dentro de /home, permite el acceso
      return NextResponse.next();

    } catch (error) {
      console.error('Error fetching user role from API:', error);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  },
  {
    callbacks: {
      async authorized({ token }) {
        const isAuthorized = !!token && !!token.user && !!token.user.id;
        console.log(`Is Authorized: ${isAuthorized}`);
        return isAuthorized;
      },
    },
  }
);

export const config = { matcher: ['/home/:path*'] };
