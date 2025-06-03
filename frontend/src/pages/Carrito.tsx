import { useState, useEffect } from "react";
import { FaTrash} from "react-icons/fa";
import { Libro } from "../models/Libro";
import { Carrito } from "../models/Carrito";
import { Header } from "../components/header";
import { CarritoService } from "../services/CarritoService";
import { URLS } from "../navigation/CONSTANTS";
import { useNavigate } from "react-router";


export const CarritoList = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Libro[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Libro | null>(null);
  const [carrito, setCarrito] = useState<Carrito>({
    id: 0,
    usuario: 0,
    libros: [],
    precio_total: "0",
  });
  const [showPagoModal, setShowPagoModal] = useState(false);
const [comprobantePreview, setComprobantePreview] = useState<File | null>(null);


  useEffect(() => {
    getCarrito();
    getLibrosCarrito();
  }, []);

  const getCarrito = () => {
    try{
      new CarritoService().getCarritos().then((response) => {
        setCarrito(response[0]);
        console.log("Carrito fetched successfully:", response);
      });
    }catch (error) {
      console.error("Error fetching carrito:", error);
    }
  };

  const getLibrosCarrito = () => {
    try {
      new CarritoService().getLibroByCarrito().then((response) => {
        setCartItems(response);
        console.log("Libros in carrito fetched successfully:", response);
      });
    } catch (error) {
      console.error("Error fetching libros in carrito:", error);
    }
  };



  const removeItem = (id?: number) => {
    if (!id) return;
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    new CarritoService().removeLibroFromCarrito(id+"").then(() => {
      console.log(`Libro with id ${id} removed from carrito`);
      getLibrosCarrito();
      getCarrito();
    }).catch((error) => {
      console.error("Error removing libro from carrito:", error);
    });
    setShowModal(false);
  };


  const handleDeleteClick = (item: Libro) => {
    setItemToDelete(item);
    setShowModal(true);
  };
const confirmarPago = () => {
  if (!comprobantePreview) {
    alert("Por favor, sube un comprobante de pago.");
    return;
  }
  new CarritoService().realizarCompra(comprobantePreview).then((response) => {
    alert("Pago confirmado exitosamente.");
    const id = response.id;
    console.log("Pago confirmado con ID:", id);
    setShowPagoModal(false);
    setComprobantePreview(null);
    getCarrito();
    getLibrosCarrito();
    navigate(URLS.COMPRA.DETALLECOMPRA.replace(":id", String(id)));
  }).catch((error) => {
    console.error("Error confirming payment:", error);
    alert("Error al confirmar el pago. Por favor, inténtalo de nuevo.");
  });
}


  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-heading font-heading text-foreground mb-8">Mi Carrito</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm">
            <p className="text-accent-foreground text-lg">Tu carrito esta vacio</p>
            <p className="text-muted-foreground mt-2">Add some books to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map(item => (
                <div key={item.id} className="bg-card p-6 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-32 flex-shrink-0">
                    <img
                      src={"http://localhost:8000"+item.imagen}
                      alt={item.titulo}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-heading text-lg text-foreground">{item.titulo}</h3>
                    <p className="text-accent">{item.autor}</p>
                    <p className="text-primary font-semibold mt-2">{item.precio} Bs</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-destructive hover:text-destructive-foreground transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg shadow-sm sticky top-4">
                <h2 className="font-heading text-lg text-foreground mb-4">Resumen de compra</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-accent">
                    <span>Libros ({cartItems.length})</span>
                    <span>{carrito.precio_total} Bs</span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>Envio</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between font-heading text-lg text-foreground">
                      <span>Total</span>
                      <span>{carrito.precio_total} Bs</span>
                    </div>
                  </div>
                </div>
                <button
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={() => setShowPagoModal(true)}
              >
                Comprar
              </button>

              </div>
            </div>
          </div>
        )}

        {showModal && itemToDelete && (
          <div className="fixed inset-0 bg-foreground bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="font-heading text-lg text-foreground mb-4">Confirm Deletion</h3>
              <p className="text-accent mb-6">Are you sure you want to remove "{itemToDelete.titulo}" from your cart?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeItem(itemToDelete.id)}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {showPagoModal && (
  <div className="fixed inset-0 bg-foreground bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
      <h3 className="font-heading text-xl text-foreground mb-4">Formulario de Pago</h3>

      <div className="mb-4">
        <p className="text-accent-foreground mb-2">Monto total a pagar:</p>
        <p className="text-foreground font-bold text-lg">{carrito.precio_total} Bs</p>
      </div>

      <div className="mb-4">
        <p className="text-accent-foreground mb-2">Escanea el QR para pagar:</p>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagoLibreriaFicticio"
          alt="QR de pago"
          className="mx-auto"
        />
      </div>

      <div className="mb-4">
        <label className="text-accent-foreground block mb-2 ">Sube tu comprobante de pago:</label>
        <input
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 border border-input rounded-md bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setComprobantePreview(file);
            } else {
              setComprobantePreview(null);
            }
          }}
        />
      </div>


      <div className="flex justify-between mt-6">
        <button
          onClick={() => setShowPagoModal(false)}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-opacity-90 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => confirmarPago()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-opacity-90 transition-colors"
          disabled={!comprobantePreview}
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
    </>
  );
};

