// modules.jsx
export const MODULES = [
    {
      Rol: "admin",
      Routes: [
        { routeName: "home", routePath: "/home", icon: "home" },
        { routeName: "usuarios", routePath: "/home", icon: "user" },
        { routeName: "programas", routePath: "/home/programas", icon: "program" },
        { routeName: "cursos", routePath: "/home", icon: "cursos" },
        { routeName: "resultados", routePath: "/home", icon: "result" },
        { routeName: "configuracion", routePath: "/home", icon: "settings" },
      ],
    },
    {
      Rol: "coordinador",
      Routes: [
        { routeName: "notas", routePath: "/notas", icon: "elicon" },
      ],
    },
    {
      Rol: "auxiliar",
      Routes: [
        { routeName: "notas", routePath: "/notas", icon: "elicon" },
      ],
    },
    {
      Rol: "profesor",
      Routes: [
        { routeName: "notas", routePath: "/notas", icon: "elicon" },
      ],
    },
  ];
  