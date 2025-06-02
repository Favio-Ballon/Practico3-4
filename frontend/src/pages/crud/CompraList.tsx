import { useState, useEffect } from "react";
import { Compra } from "../../models/Compra";
import { CompraService } from "../../services/CompraService";
import { Header } from "../../components/header";
import { format } from "date-fns";

export const CompraList = () => {
  const [compras, setCompras] = useState<Compra[]>([]);


  const getCompras = async () => {
    try {
      const data = await new CompraService().getComprasAdmin();
      setCompras(data);
    } catch (error) {
      console.error("Error al obtener las compras:", error);
    }
  };

  useEffect(() => {
    getCompras();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-heading font-heading mb-8 text-foreground">Historial de Compras</h1>

          <div className="bg-card shadow-sm rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Libros</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{compra.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{format(new Date(compra.fecha), "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{compra.total}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {compra.libro.map((l) => l.titulo).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {compra.comprobante_pago ? (
                        <a
                          href={compra.comprobante_pago}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Ver comprobante
                        </a>
                      ) : (
                        "No disponible"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
