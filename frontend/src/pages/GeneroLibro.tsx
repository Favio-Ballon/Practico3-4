import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { Libro } from "../models/Libro";
import { Genero } from "../models/Genero";
import { GeneroService } from "../services/GeneroService";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/header";
import { URLS } from "../navigation/CONSTANTS";

interface BookCardProps {
  libro: Libro;
  onClick: (libro: Libro) => void;
}

const BookCard: React.FC<BookCardProps> = ({ libro, onClick}) => (
  <div className="flex flex-col md:flex-row bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="w-full md:w-1/3 h-48 md:h-auto relative">
      <img
        src={"http://127.0.0.1:8000/" + libro.imagen}
        alt={libro.titulo}
        className="w-full h-full object-cover"
        
      />
    </div>
    <div className="p-4 md:w-2/3 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-heading text-foreground mb-2">{libro.titulo}</h3>
        <p className="text-accent mb-2">{libro.autor}</p>
        <p className="text-primary font-bold mb-4">${Number(libro.precio).toFixed(2)}</p>
      </div>
      <button
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-300"
        onClick={() => onClick(libro)}
      >
        Ver más <BsArrowRight className="ml-1" />
      </button>
    </div>
  </div>
);

export const GeneroLibro = () => {
  const [libros, setLibros] = useState<Libro[]>([
    {
      id: 1,
      titulo: "",
      autor: "",
      precio: "",
      imagen: "",
        descripcion: "",
        isbn: "",
        ventas: 1500,
        genero: [1]
    },
  ]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState<Genero>(
    {
      id: "1",
      nombre: "Fantasía",
    }
  );
  const navigate = useNavigate();

  //sacar id del header
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    if (id) {
      getGenero();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getLibrosByGenero();
    }
  }, [generoSeleccionado, id]);

  const getGenero = () => {
    if (!id) return;
    new GeneroService().getGenero(id).then((genero) => {
      setGeneroSeleccionado(genero);
    }).catch((error) => {
      console.error("Error al obtener el género:", error);
    });
  };

  const getLibrosByGenero = () => {
    if (!id) return;
    new GeneroService().getLibroByGenero(id).then((libros) => {
      setLibros(libros);
    }).catch((error) => {
      console.error("Error al obtener los libros por género:", error);
    });
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaBook className="text-4xl text-primary" />
          <h1 className="text-4xl font-heading text-foreground">{generoSeleccionado.nombre}</h1>
        </div>

        {libros.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-accent text-lg">No hay libros disponibles en este género</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {libros.map((libro) => (
              <BookCard
                key={libro.id}
                libro={libro}
                onClick={(libro) => navigate(URLS.LIBROS.LIBRODETALLE.replace(":id", String(libro.id)))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
