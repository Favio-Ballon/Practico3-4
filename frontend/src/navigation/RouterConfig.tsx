import { Routes, Route } from "react-router";

import { URLS } from "./CONSTANTS";
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/registerForm";
import { Main } from "../pages/main";
import { GeneroLibro } from "../pages/GeneroLibro";
import { LibroDetalle } from "../pages/LibroDetalle";

const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.HOME} element={< Main/>} />
            <Route path={URLS.LOGIN} element={< LoginForm />} />
            <Route path={URLS.REGISTER} element={< RegisterForm />} />
            <Route path={URLS.GENEROS.GENEROLIBROS} element={<GeneroLibro/>} />
            <Route path={URLS.LIBROS.LIBRODETALLE} element={<LibroDetalle/>} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}
export default RouterConfig;