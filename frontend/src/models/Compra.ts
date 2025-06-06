import { Libro } from "./Libro";

export interface Compra {
    id: number;
    fecha: string;
    total: string;
    comprobante_pago: string | null;
    usuario: number;
    libro: Libro[];
}