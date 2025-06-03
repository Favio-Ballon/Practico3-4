import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Compra } from "../models/Compra";
import { Header } from "../components/header";
import { CompraService } from "../services/CompraService";

export const DetalleCompra = () => {
  const { id } = useParams();
  const [compra, setCompra] = useState<Compra | null>(null);

  useEffect(() => {
    getCompraById();
  }, [id]);

  const getCompraById = async () => {
    if (!id) return;
    try {
      new CompraService().getCompra(id).then((compraData) => {
        setCompra(compraData);
      }
      ).catch((error) => {
        console.error("Error al obtener la compra:", error);
      });
    } catch (error) {
      console.error("Error al obtener la compra:", error);
    }
  }

  if (!compra) {
    return <p className="p-8 text-center text-muted-foreground">Cargando compra...</p>;
  }

  return (
  <>
    <Header />
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-card p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Detalle de la Compra #{compra.id}
        </h1>

        <div className="space-y-2 text-center">
          <p>
            <span className="font-semibold text-accent-foreground">Usuario:</span>{" "}
            <span className="text-foreground">{compra.usuario}</span>
          </p>
          <p>
            <span className="font-semibold text-accent-foreground">Fecha:</span>{" "}
            <span className="text-foreground">
              {new Date(compra.fecha).toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-semibold text-accent-foreground">Total:</span>{" "}
            <span className="text-primary font-bold text-lg">{compra.total} Bs</span>
          </p>
        </div>

        {compra.comprobante_pago && (
          <div className="text-center">
            <p className="text-accent-foreground font-semibold mb-2">
              Comprobante de Pago:
            </p>
            <img
              src={compra.comprobante_pago}
              alt="Comprobante"
              className="mx-auto w-full max-w-md rounded-md border shadow-sm"
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-accent-foreground mb-4 text-center">
            Libros Comprados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compra.libro.map((libro) => (
              <div
                key={libro.id}
                className="flex items-center gap-4 bg-muted p-4 rounded-xl shadow-sm"
              >
                <img
                  src={libro.imagen}
                  alt={libro.titulo}
                  className="w-16 h-24 object-cover rounded-md"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e")
                  }
                />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{libro.titulo}</p>
                  <p className="text-sm text-accent">{libro.autor}</p>
                  <p className="text-primary font-bold">{libro.precio} Bs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

};
