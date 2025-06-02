import React, { useState, useEffect } from "react";
import { FiX, FiShoppingCart } from "react-icons/fi";
import { Header } from "../components/header";
import { Libro } from "../models/Libro";
import { getLibros, LibroService } from "../services/LibroService";
import { Genero } from "../models/Genero";
import { GeneroService } from "../services/GeneroService";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONSTANTS";
import { LibroDetalle } from './LibroDetalle';


export const Main = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([
    { id: "1", nombre: "Fiction"},
  { id: "2", nombre: "Non-Fiction"},
  ]
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    getLibroList();
    getGeneroList();
  }, []);

  const getLibroList = async () => {
    try {
      const librosResponse = await new LibroService().getLibros();
      setLibros(librosResponse);
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

  // const BookDetail: React.FC<{ libro: Libro; onClose: () => void }> = ({ libro, onClose }) => (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  //     <div className="bg-card dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
  //       <div className="p-6">
  //         <div className="flex justify-end">
  //           <button onClick={onClose} className="text-accent hover:text-primary">
  //             <FiX className="w-6 h-6" />
  //           </button>
  //         </div>
  //         <div className="flex flex-col md:flex-row gap-6">
  //           <img
  //             src={libro.imagen || "https://via.placeholder.com/150"}
  //             alt={libro.titulo}
  //             className="w-full md:w-1/2 h-80 object-cover rounded-lg"
  //           />
  //           <div>
  //             <h2 className="text-2xl font-bold text-foreground dark:text-white">{libro.titulo}</h2>
  //             <p className="text-accent dark:text-gray-400 mt-2">{libro.autor}</p>
  //             <p className="mt-4 text-foreground dark:text-white">{libro.descripcion}</p>
  //             <p className="text-2xl font-bold text-primary mt-4">${libro.precio}</p>
  //             <button className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center gap-2">
  //               <FiShoppingCart className="w-5 h-5" />
  //               Add to Cart
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const BestSellers: React.FC = () => (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-heading font-heading mb-8 text-foreground dark:text-white">Top 10 Best-Selling Books</h2>
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
      {/* {selectedBook && (
        <BookDetail
          libro={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )} */}
    </div>
  );
};
