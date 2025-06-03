import React, { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Libro } from "../models/Libro";
import { LibroService } from "../services/LibroService";
import { Genero } from "../models/Genero";
import { GeneroService } from "../services/GeneroService";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONSTANTS";


export const Main = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([
    { id: "1", nombre: "Fiction"},
  { id: "2", nombre: "Non-Fiction"},
  ]
  );


  useEffect(() => {
    getLibroList();
    getGeneroList();
  }, []);

  const getLibroList = async () => {
    try {
      const librosResponse = await new LibroService().getLibros();
      setLibros(librosResponse.slice(0, 10));
      console.log("Libros fetched successfully:", librosResponse);
    } catch (error) {
      console.error("Error fetching libros:", error);
    }
  };

  const getGeneroList = async () => {
    try {
      const generosResponse = await new GeneroService().getGeneros();
      setGeneros(generosResponse);
      console.log("Géneros fetched successfully:", generos);
    } catch (error) {
      console.error("Error fetching géneros:", error);
    }
  };



  const GenresSection = () => (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-heading font-heading mb-8 text-foreground dark:text-white">Géneros</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {generos.map((genero) => (
          <div
            key={genero.id}
            className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            onClick={() => {
              navigate(URLS.GENEROS.GENEROLIBROS.replace(":id", genero.id));
            }}
          >
            <img
              src={`https://dummyimage.com/300/000/fff&text=${genero.nombre}`}
              alt={genero.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">{genero.nombre}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const BookCard: React.FC<{ libro: Libro; onClick: (libro: Libro) => void }> = ({ libro, onClick }) => (
    <div
      onClick={() => {
          navigate(URLS.LIBROS.LIBRODETALLE.replace(":id", String(libro.id)));
      }}
      className="bg-card dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <img
        src={libro.imagen || "https://via.placeholder.com/150"}
        alt={libro.titulo}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground dark:text-white">{libro.titulo}</h3>
        <p className="text-accent dark:text-gray-400">{libro.autor}</p>
        <p className="mt-2 text-primary font-bold">${libro.precio}</p>
      </div>
    </div>
  );
  const BestSellers = () => (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-heading font-heading mb-8 text-foreground dark:text-white">Top 10 libros mas vendidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libros.map((libro) => (
          <BookCard
            key={libro.id}
            libro={libro}
            onClick={setSelectedBook}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main>
        <GenresSection />
        <BestSellers />
      </main>

    </div>
  );
};
