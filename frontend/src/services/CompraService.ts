import { Compra } from "../models/Compra";
import apiClient from "./interceptors";

export class CompraService {
  getCompras(): Promise<Array<Compra>> {
    return new Promise<Array<Compra>>((resolve, reject) => {
      apiClient
        .get("compras/")
        .then((response) => {
          resolve(response.data.results);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las compras: " + error.message));
        });
    });
  }

  getComprasAdmin(): Promise<Array<Compra>> {
    return new Promise<Array<Compra>>((resolve, reject) => {
      apiClient
        .get("compras/admin/")
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las compras: " + error.message));
        });
    });
  }

  getCompra(id: string): Promise<Compra> {
    return new Promise<Compra>((resolve, reject) => {
      apiClient
        .get("compras/" + id + "/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error("Error al obtener la compra: " + error.message));
        });
    });
  }
}
