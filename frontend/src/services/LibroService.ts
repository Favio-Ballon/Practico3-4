import { Libro } from "../models/Libro";
import apiClient from "./interceptors";

export class LibroService {
  getLibros(): Promise<Array<Libro>> {
    return new Promise<Array<Libro>>((resolve, reject) => {
      apiClient
        .get("libros/")
        .then((response) => {
          resolve(response.data.results);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las libros: " + error.message));
        });
    });
  }
  getLibro(id: string): Promise<Libro> {
    return new Promise<Libro>((resolve, reject) => {
      apiClient
        .get("libros/" + id + "/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al obtener la libro: " + error.message));
        });
    });
  }

  insertLibro(libro: Libro): Promise<Libro> {
    return new Promise<Libro>((resolve, reject) => {
      const formData = new FormData();
      formData.append("titulo", libro.titulo);
      formData.append("autor", libro.autor);
      formData.append("descripcion", libro.descripcion);
      formData.append("isbn", libro.isbn);
      formData.append("precio", libro.precio);
      if (libro.imagen instanceof File) {
        formData.append("imagen", libro.imagen);
      } else {
        formData.append("imagen", libro.imagen as string);
      }
      formData.append("ventas", libro.ventas.toString());
      (libro.genero as number[]).forEach((id) => {
        formData.append("genero", String(id));
      });
      apiClient
        .post("libros/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la libro: " + error.message));
        });
    });
  }
  updateLibro(libro: Libro): Promise<Libro> {
    return new Promise<Libro>((resolve, reject) => {
      const formData = new FormData();
      formData.append("titulo", libro.titulo);
      formData.append("autor", libro.autor);
      formData.append("descripcion", libro.descripcion);
      formData.append("isbn", libro.isbn);
      formData.append("precio", libro.precio);
      if (libro.imagen instanceof File) {
        formData.append("imagen", libro.imagen);
      }
      formData.append("ventas", libro.ventas.toString());
      (libro.genero as number[]).forEach((id) => {
        formData.append("genero", String(id));
      });
      apiClient
        .patch("libros/" + libro.id + "/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la libro: " + error.message));
        });
    });
  }
  deleteLibro(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient
        .delete("libros/" + id + "/")
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(new Error("Error al eliminar la libro: " + error.message));
        });
    });
  }
}
