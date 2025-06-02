import { Genero } from "../models/Genero";
import { Libro } from "../models/Libro";
import apiClient from "./interceptors";

export class GeneroService {
  getGeneros(): Promise<Array<Genero>> {
    return new Promise<Array<Genero>>((resolve, reject) => {
      apiClient
        .get("generos/")
        .then((response) => {
          resolve(response.data.results);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las generos: " + error.message));
        });
    });
  }
  getGenero(id: string): Promise<Genero> {
    return new Promise<Genero>((resolve, reject) => {
      apiClient
        .get("generos/" + id + "/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al obtener la genero: " + error.message));
        });
    });
  }

  getLibroByGenero(id: string): Promise<Array<Libro>> {
    return new Promise<Array<Libro>>((resolve, reject) => {
      apiClient
        .get("generos/" + id + "/libros/")
        .then((response) => {
          resolve(response.data.libros);
        })
        .catch((error) => {
          reject(
            new Error(
              "Error al obtener los libros por genero: " + error.message
            )
          );
        });
    });
  }

  insertGenero(genero: Genero): Promise<Genero> {
    return new Promise<Genero>((resolve, reject) => {
      apiClient
        .post("generos/", genero)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la genero: " + error.message));
        });
    });
  }
  updateGenero(genero: Genero): Promise<Genero> {
    return new Promise<Genero>((resolve, reject) => {
      apiClient
        .put("generos/" + genero.id + "/", genero)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la genero: " + error.message));
        });
    });
  }
  deleteGenero(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient
        .delete("generos/" + id + "/")
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(new Error("Error al eliminar la genero: " + error.message));
        });
    });
  }
}
