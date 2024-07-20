// modules.jsx
export const MODULES = [
    {
      Rol: "admin",
      Routes: [
        { routeName: "Area personal", routePath: "/home/area-personal", icon: "home" },
        { routeName: "Usuarios", routePath: "/home/usuarios", icon: "user" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home", icon: "curso" },
        { routeName: "Resultados Ap", routePath: "/home", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "coordinador",
      Routes: [
        { routeName: "Area personal", routePath: "/home", icon: "home" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home", icon: "curso" },
        { routeName: "Resultados Ap", routePath: "/home", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "auxiliar",
      Routes: [
        { routeName: "Area personal", routePath: "/home", icon: "home" },
        { routeName: "Programas", routePath: "/home/programas", icon: "program" },
        { routeName: "Cursos", routePath: "/home", icon: "curso" },
        { routeName: "Resultados Ap", routePath: "/home", icon: "result" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "profesor",
      Routes: [
        { routeName: "Area personal", routePath: "/home", icon: "home" },
        { routeName: "Cursos", routePath: "/home", icon: "curso" },
        { routeName: "Centro de ayuda", routePath: "/ayuda", icon: "help" },
        { routeName: "Configuracion", routePath: "/home", icon: "settings" },
      ],
    },
  ];
  