import { Carrito } from "../models/Carrito";
import { Libro } from "../models/Libro";
import apiClient from "./interceptors";

interface compra_id {
  id: string;
}

export class CarritoService {
  getCarritos(): Promise<Array<Carrito>> {
    return new Promise<Array<Carrito>>((resolve, reject) => {
      apiClient
        .get("carrito/")
        .then((response) => {
          resolve(response.data.results);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las carritos: " + error.message));
        });
    });
  }
  addLibroToCarrito(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      apiClient
        .post("carrito/addlibro/", { libro_id: id })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            new Error("Error al añadir el libro al carrito: " + error.message)
          );
        });
    });
  }

  removeLibroFromCarrito(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      apiClient
        .post("carrito/removelibro/", { libro_id: id })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            new Error(
              "Error al eliminar el libro del carrito: " + error.message
            )
          );
        });
    });
  }

  realizarCompra(comprobante_pago: File): Promise<compra_id> {
    const formData = new FormData();
    formData.append("comprobante_pago", comprobante_pago);
    return new Promise<compra_id>((resolve, reject) => {
      apiClient
        .post("carrito/comprar/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al realizar la compra: " + error.message));
        });
    });
  }

  getLibroByCarrito(): Promise<Array<Libro>> {
    return new Promise<Array<Libro>>((resolve, reject) => {
      apiClient
        .get("carrito/libros/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            new Error(
              "Error al obtener los libros por carrito: " + error.message
            )
          );
        });
    });
  }

  insertCarrito(carrito: Carrito): Promise<Carrito> {
    return new Promise<Carrito>((resolve, reject) => {
      apiClient
        .post("carritos/", carrito)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la carrito: " + error.message));
        });
    });
  }
  updateCarrito(carrito: Carrito): Promise<Carrito> {
    return new Promise<Carrito>((resolve, reject) => {
      apiClient
        .put("carritos/" + carrito.id + "/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al insertar la carrito: " + error.message));
        });
    });
  }
  deleteCarrito(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient
        .delete("carritos/" + id + "/")
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(new Error("Error al eliminar la carrito: " + error.message));
        });
    });
  }
}
