// modules.jsx
export const MODULES = [
    {
      Rol: "Admin",
      Routes: [
        { routeName: "Area personal", routePath: "/home/area-personal", icon: "home" },
        { routeName: "Usuarios", routePath: "/home/usuarios", icon: "user" },
        { routeName: "Facultades", routePath: "/home/facultades", icon: "curso" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home/cursos", icon: "curso" },
        { routeName: "Sedes", routePath: "/home/cursos", icon: "help" },
        { routeName: "Resultados Ap", routePath: "/home/resultados-ap", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "Coordinador",
      Routes: [
        { routeName: "Area personal", routePath: "/home/area-personal", icon: "home" },
        { routeName: "Facultades", routePath: "/home/facultades", icon: "curso" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home/cursos", icon: "curso" },
        { routeName: "Sedes", routePath: "/home/cursos", icon: "help" },
        { routeName: "Resultados Ap", routePath: "/home", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "Auxiliar",
      Routes: [
        { routeName: "Area personal", routePath: "/home/area-personal", icon: "home" },
        { routeName: "Facultades", routePath: "/home/facultades", icon: "curso" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home/cursos", icon: "curso" },
        { routeName: "Resultados Ap", routePath: "/home", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "Profesor",
      Routes: [
        { routeName: "Area personal", routePath: "/home/area-personal", icon: "home" },
        { routeName: "Cursos", routePath: "/home/cursos", icon: "curso" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
  ];
  