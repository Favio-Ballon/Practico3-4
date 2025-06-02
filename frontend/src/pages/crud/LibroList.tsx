import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Libro } from "../../models/Libro";
import { LibroService } from "../../services/LibroService";
import { Header } from "../../components/header";
import { Genero } from "../../models/Genero";
import { GeneroService } from "../../services/GeneroService";

interface FormData {
  titulo: string;
  autor: string;
  descripcion: string;
  isbn: string;
  precio: string;
  imagen: string | File;
  genero: number[];
}

interface FormErrors {
  titulo?: string;
  autor?: string;
  precio?: string;
}

export const LibroList = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLibro, setCurrentLibro] = useState<Libro | null>(null);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    autor: "",
    descripcion: "",
    isbn: "",
    precio: "",
    imagen: "",
    genero: []
  });
  const [errors, setErrors] = useState<FormErrors>({});


  const getLibros = async () => {
    try {
      const data = await new LibroService().getLibros();
      setLibros(data);
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  useEffect(() => {
    getLibros();
    getGeneros();
  }, []);

  const getGeneros = async () => {
    try {
      const data = await new GeneroService().getGeneros();
      console.log("Géneros obtenidos:", data);
      setGeneros(data);
    } catch (error) {
      console.error("Error al obtener los géneros:", error);
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.titulo) newErrors.titulo = "Título obligatorio";
    if (!formData.autor) newErrors.autor = "Autor obligatorio";
    if (!formData.precio || isNaN(Number(formData.precio))) newErrors.precio = "Precio inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateForm()) {
      try {
        await new LibroService().insertLibro({
          ...formData,
          id: 0,
          ventas: 0
        });
        getLibros();
        setIsCreateModalOpen(false);
        setFormData({ titulo: "", autor: "", descripcion: "", isbn: "", precio: "", imagen: "", genero: [] });
      } catch (error) {
        console.error("Error al crear libro:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (validateForm() && currentLibro) {
      try {
        await new LibroService().updateLibro({
          ...formData,
          id: currentLibro.id,
          ventas: currentLibro.ventas
        });
        getLibros();
        setIsEditModalOpen(false);
        setCurrentLibro(null);
        setFormData({ titulo: "", autor: "", descripcion: "", isbn: "", precio: "", imagen: "", genero: [] });
      } catch (error) {
        console.error("Error al actualizar libro:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (currentLibro) {
      try {
        await new LibroService().deleteLibro(currentLibro.id.toString());
        getLibros();
        setIsDeleteModalOpen(false);
        setCurrentLibro(null);
      } catch (error) {
        console.error("Error al eliminar libro:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-heading font-heading mb-8 text-foreground">Gestión de Libros</h1>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-primary/90 flex items-center gap-2"
            >
              <FiPlus /> Crear Libro
            </button>
          </div>

          <div className="bg-card shadow-sm rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Autor</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Imagen</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">ISBN</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Géneros</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-heading text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr key={libro.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm text-foreground">{libro.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{libro.titulo}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{libro.autor}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <img
                        src={
                          typeof libro.imagen === "string"
                            ? libro.imagen
                            : libro.imagen instanceof File
                            ? URL.createObjectURL(libro.imagen)
                            : undefined
                        }
                        alt={libro.titulo}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{libro.isbn}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{libro.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {libro.genero.map((g) => (
                        <span key={g} className="inline-block bg-muted px-2 py-1 rounded-full text-xs mr-2">
                          {generos.find((gen) => Number(gen.id) === Number(g))?.nombre || "Desconocido"}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{libro.precio}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => {
                          setCurrentLibro(libro);
                          setFormData({ ...libro });
                          setIsEditModalOpen(true);
                        }}
                        className="text-accent hover:text-primary p-1 rounded-sm"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLibro(libro);
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

          {/* Modales Create/Edit */}
          {(isCreateModalOpen || isEditModalOpen) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 mt-10">
              <div className="bg-card p-6 rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-heading font-heading mb-4">
                  {isCreateModalOpen ? "Crear" : "Editar"} Libro
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full border border-input rounded-sm p-2"
                  />
                  {errors.titulo && <p className="text-destructive text-sm">{errors.titulo}</p>}

                  <input
                    type="text"
                    placeholder="Autor"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    className="w-full border border-input rounded-sm p-2"
                  />
                  {errors.autor && <p className="text-destructive text-sm">{errors.autor}</p>}

                  <textarea
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full border border-input rounded-sm p-2"
                  />

                  <input
                    type="text"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full border border-input rounded-sm p-2"
                  />

                  <input
                    type="text"
                    placeholder="Precio"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full border border-input rounded-sm p-2"
                  />
                  {errors.precio && <p className="text-destructive text-sm">{errors.precio}</p>}

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border border-input rounded-md bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({ ...formData, imagen: file || "" });
                    }}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Géneros</label>
                    <div className="max-h-40 overflow-y-auto border border-input rounded p-2">
                      {generos.map((g) => (
                        <label key={g.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            value={g.id}
                            checked={formData.genero.includes(Number(g.id))}
                            onChange={(e) => {
                              const id = parseInt(e.target.value);
                              setFormData((prev) => ({
                                ...prev,
                                genero: prev.genero.includes(id)
                                  ? prev.genero.filter((gid) => gid !== id)
                                  : [...prev.genero, id]
                              }));
                            }}
                          />
                          {g.nombre}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData({ titulo: "", autor: "", descripcion: "", isbn: "", precio: "", imagen: "", genero: [] });
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

          {/* Modal Delete */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-card p-6 rounded-sm max-w-md w-full">
                <h2 className="text-heading font-heading mb-4">Confirmar Eliminación</h2>
                <p className="text-foreground mb-6">
                  ¿Está seguro que desea eliminar este libro?
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
