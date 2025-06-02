import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiChevronRight, FiShoppingBag, FiAlertCircle } from "react-icons/fi";
import { Compra } from "../models/Compra";
import { CompraService } from "../services/CompraService";
import { Header } from "../components/header";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONSTANTS";

export const ComprasUser = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Compra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const comprasData = await new CompraService().getCompras();
        setPurchases(comprasData);
      } catch (err) {
        setError("Error al cargar las compras. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-heading font-heading text-foreground mb-8">Mis Compras</h1>

      {purchases.length === 0 ? (
        <div className="bg-card p-8 rounded-lg shadow-sm text-center">
          <FiShoppingBag className="w-16 h-16 mx-auto text-accent mb-4" />
          <h2 className="text-lg font-semibold mb-2">No tienes compras aún</h2>
          <p className="text-accent-foreground mb-4">
            Explora nuestra colección de libros y realiza tu primera compra.
          </p>
          <button
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => console.log("Navigate to books")}
          >
            Explorar Libros
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-foreground font-heading">Fecha</th>
                <th className="text-left p-4 text-foreground font-heading">Libros</th>
                <th className="text-right p-4 text-foreground font-heading">Total</th>
                <th className="text-right p-4 text-foreground font-heading">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr
                  key={purchase.id}
                  className={`${
                    index % 2 === 0 ? "bg-background" : "bg-card"
                  } hover:bg-muted transition-colors`}
                >
                  <td className="p-4 text-foreground">
                    {format(new Date(purchase.fecha), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-4 text-foreground">{purchase.libro.length}</td>
                  <td className="p-4 text-right text-foreground">
                    {purchase.total + " Bs"}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(URLS.COMPRA.DETALLECOMPRA.replace(":id", String(purchase.id)))}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                      aria-label={`Ver detalles de la compra del ${format(new Date(purchase.fecha), "dd/MM/yyyy")}`}
                    >
                      Ver Detalle
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};
