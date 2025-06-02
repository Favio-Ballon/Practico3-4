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
      apiClient
        .post("libros/", libro)
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
      apiClient
        .put("libros/" + libro.id + "/")
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
