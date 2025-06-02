import  { useState, useEffect, ChangeEvent } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Genero } from "../../models/Genero";
import { GeneroService } from "../../services/GeneroService";
import { Header } from "../../components/header";

interface FormData {
  nombre: string;
}

interface FormErrors {
  nombre?: string;
}

export const GeneroList = () => {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentGenero, setCurrentGenero] = useState<Genero | null>(null);
  const [formData, setFormData] = useState<FormData>({ nombre: "" });
  const [errors, setErrors] = useState<FormErrors>({});


  const getGeneros = async () => {
    try {
      const data = await new GeneroService().getGeneros();
      setGeneros(data);
    } catch (error) {
      console.error("Error al obtener los géneros:", error);
    }
  };

  useEffect(() => {
    getGeneros();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre || formData.nombre.length < 2 || /\d/.test(formData.nombre)) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres y no contener números.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateForm()) {
      try {
        await new GeneroService().insertGenero({
          nombre: formData.nombre,
          id: ""
        });
        getGeneros();
        setIsCreateModalOpen(false);
        setFormData({ nombre: "" });
      } catch (error) {
        console.error("Error al crear género:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (validateForm() && currentGenero) {
      try {
        await new GeneroService().updateGenero({ id: currentGenero.id, nombre: formData.nombre });
        getGeneros();
        setIsEditModalOpen(false);
        setCurrentGenero(null);
        setFormData({ nombre: "" });
      } catch (error) {
        console.error("Error al actualizar género:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (currentGenero) {
      try {
        await new GeneroService().deleteGenero(currentGenero.id);
        getGeneros();
        setIsDeleteModalOpen(false);
        setCurrentGenero(null);
      } catch (error) {
        console.error("Error al eliminar género:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-heading font-heading mb-8 text-foreground">Gestión de Géneros</h1>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-primary/90 flex items-center gap-2"
            >
              <FiPlus /> Crear Género
            </button>
          </div>

          <div className="bg-card shadow-sm rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {generos.map((genero) => (
                  <tr key={genero.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{genero.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{genero.nombre}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => {
                          setCurrentGenero(genero);
                          setFormData({ nombre: genero.nombre });
                          setIsEditModalOpen(true);
                        }}
                        className="text-accent hover:text-primary p-1 rounded-sm"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentGenero(genero);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-accent hover:text-destructive p-1 rounded-sm"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(isCreateModalOpen || isEditModalOpen) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-card p-6 rounded-sm max-w-md w-full">
                <h2 className="text-heading font-heading mb-4">
                  {isCreateModalOpen ? "Crear" : "Editar"} Género
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full border border-input rounded-sm p-2 focus:ring-2 focus:ring-ring focus:outline-none"
                    />
                    {errors.nombre && (
                      <p className="text-destructive text-sm mt-1">{errors.nombre}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData({ nombre: "" });
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-input rounded-sm hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={isCreateModalOpen ? handleCreate : handleEdit}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
                  >
                    {isCreateModalOpen ? "Crear" : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-card p-6 rounded-sm max-w-md w-full">
                <h2 className="text-heading font-heading mb-4">Confirmar Eliminación</h2>
                <p className="text-foreground mb-6">
                  ¿Está seguro que desea eliminar este género?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border border-input rounded-sm hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/90"
                  >
                    Eliminar
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
