import { useState, useEffect } from "react";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { Libro } from "../models/Libro"; // Asegúrate de que esté bien la ruta
import { Header } from "../components/header";
import { LibroService } from "../services/LibroService";
import { useAppSelector } from "../redux/hooks";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/CONSTANTS";

export const LibroDetalle = () => {
  const [book, setBook] = useState<Libro | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const first_name = useAppSelector((state) => state.auth.first_name);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    if (first_name) {
      console.log("User is authenticated:", first_name);
      setIsAuthenticated(true);
    }
  }
  , [first_name]);

  useEffect(() => {
    if (id) {
    getLibroById();
    }
  }, [id]);

const getLibroById = async () => {
  try {
    if (!id) return;
        setLoading(true);
        new LibroService().getLibro(id).then((response) => {
          setBook(response);
        });
      } catch (err) {
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <BiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive text-lg">{error || "Book not found"}</div>
      </div>
    );
  }

  const handleCartAction = () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    setIsInCart(!isInCart);
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <nav className="mb-8">
        <ol className="flex space-x-2 text-accent">
          <li><a href="/" className="hover:text-primary">Home</a></li>
          <li>/</li>
          <li className="text-primary">{book.titulo}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <img
              src={book.imagen}
              alt={book.titulo}
              className="w-full rounded-lg shadow-lg transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-heading font-heading text-foreground">{book.titulo}</h1>
            <h2 className="text-xl text-accent">{book.autor}</h2>
            <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>

            <div className="prose max-w-none">
              <p className="text-body text-foreground">
                {expanded ? book.descripcion : `${book.descripcion.slice(0, 200)}...`}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary ml-2 hover:underline focus:outline-none"
                >
                  {expanded ? "Read Less" : "Read More"}
                </button>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-foreground">${Number(book.precio).toFixed(2)}</span>
            </div>

            <button
              onClick={handleCartAction}
              className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${isInCart ? "bg-destructive" : "bg-primary"} text-white disabled:opacity-50`}
            >
              {isInCart ? (
                <>
                  <FaTrash className="w-5 h-5" />
                  <span>Remove from Cart</span>
                </>
              ) : (
                <>
                  <FaShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-heading text-foreground mb-4">Please Log In</h3>
            <p className="text-accent mb-6">You need to be logged in to add items to your cart.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  navigate(URLS.LOGIN);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
