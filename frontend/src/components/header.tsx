import { useEffect, useState } from "react";
import { FiMenu, FiX, } from "react-icons/fi";
import { useAppSelector } from "../redux/hooks";
import { useAuth } from "../hooks/useAuth";
import { URLS } from "../navigation/CONSTANTS";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>("");
  const first_name = useAppSelector((state) => state.auth.first_name);
  const last_name = useAppSelector((state) => state.auth.last_name);
  const is_staff = useAppSelector((state) => state.auth.is_staff);
  const { doLogout } = useAuth()
  
  useEffect(() => {
    if (first_name && last_name) {
      setNombre(`${first_name} ${last_name}`);
    } 
  }
  , [first_name]);

  useEffect(() => {
    console.log("is_staff", is_staff);
    if (is_staff){
      console.log("is_staff", is_staff);
      setNombre("Administrador");
    }
  }
  , [is_staff]);

  

  return (
    <header className="sticky top-0 z-50 bg-card dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">BookStore</div>
          <div className="hidden md:flex items-center space-x-6">
            {
            (first_name && last_name) || is_staff ? (
              <>
                {is_staff ? (
                  <>
                    <a href="/admin/generos" className="text-foreground dark:text-white hover:text-primary">Generos</a>
                    <a href="/admin/libros" className="text-foreground dark:text-white hover:text-primary">Libros</a>
                    <a href="/admin/ventas" className="text-foreground dark:text-white hover:text-primary">Ventas</a>
                    <a href="/admin/usuarios" className="text-foreground dark:text-white hover:text-primary">Usuarios</a>
                    <a className="text-foreground dark:text-white hover:text-primary">Administrador</a>
                  </>
                ) : (
                  <>
                  <a href="/" className="text-foreground dark:text-white hover:text-primary">Inicio</a>
                    <a href={URLS.COMPRA.COMPRAUSER} className="text-foreground dark:text-white hover:text-primary">Mis Compras</a>
                    <a href={URLS.CARRITO} className="text-foreground dark:text-white hover:text-primary">Mi Carrito</a>
                    <a className="text-foreground dark:text-white hover:text-primary">{`${first_name} ${last_name}`}</a>
                  </>
                )}
                <a
                  href="#"
                  className="text-foreground dark:text-white hover:text-primary"
                  onClick={() => {
                    doLogout();
                  }}
                >
                  Cerrar Sesión
                </a>
              </>
            ) : (
              <a href={URLS.LOGIN} className="text-foreground dark:text-white hover:text-primary">Iniciar Sesión</a>
            )
          }
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <a href="#" className="block text-foreground dark:text-white hover:text-primary">Inicio</a>
            <a href="#" className="block text-foreground dark:text-white hover:text-primary">Géneros</a>
            <a href="#" className="block text-foreground dark:text-white hover:text-primary">Mis Compras</a>
            <a href="#" className="block text-foreground dark:text-white hover:text-primary">Iniciar Sesión</a>
          </div>
        )}
      </nav>
    </header>
      )
    };