// modules.jsx
export const MODULES = [
    {
      Rol: "admin",
      Routes: [
        { routeName: "home", routePath: "/home", icon: "home" },
        { routeName: "usuarios", routePath: "/usuarios", icon: "user" },
        { routeName: "programas", routePath: "/programas", icon: "program" },
        { routeName: "cursos", routePath: "/cursos", icon: "cursos" },
        { routeName: "resultados", routePath: "/resultadosaprendizaje", icon: "result" },
        { routeName: "configuracion", routePath: "/configuracion", icon: "settings" },
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
  