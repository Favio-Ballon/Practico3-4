export const URLS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
  GENEROS: {
    LIST: "/generos",
    CREATE: "/generos/create",
    EDIT: "/generos/:id",
    UPDATE: (id: string) => {
      return `/generos/${id}`;
    },
    GENEROLIBROS: "/generos/:id/libros",
  },
  LIBROS: {
    LIST: "/libros",
    CREATE: "/libros/create",
    EDIT: "/libros/:id",
    UPDATE: (id: string) => {
      return `/libros/${id}`;
    },
    LIBRODETALLE: "/libros/:id/detalle",
  },
};
