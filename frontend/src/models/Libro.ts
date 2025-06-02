export interface Libro {
    id: number;
    titulo: string;
    autor: string;
    descripcion: string;
    isbn: string;
    precio: string;
    imagen: string | File;
    ventas: number;
    genero: number[];
}