import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import { FiUsers } from "react-icons/fi";
import { UserInfoResponse } from "../../models/dto/UserInfoResponse";
import { AuthService } from "../../services/AuthService";

export const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState<UserInfoResponse[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await new AuthService().all();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-heading font-heading mb-8 text-foreground flex items-center gap-2">
            <FiUsers /> Lista de Usuarios
          </h1>
          <div className="bg-card shadow-sm rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Correo</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Staff</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{usuario.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{usuario.first_name} {usuario.last_name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{usuario.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {usuario.is_staff ? "Sí" : "No"}
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
