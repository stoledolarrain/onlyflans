import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DashboardCreador from "./pages/DashboardCreador";
import FeedSeguidor from "./pages/FeedSeguidor";
import ListaCreadores from "./pages/ListaCreadores";
import PerfilCreador from "./pages/PerfilCreador";
import HistorialSeguidor from "./pages/HistorialSeguidor";
import ReporteIngresos from "./pages/ReporteIngresos";

const RutaProtegida = ({ rolRequerido }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // 1. Si no hay token, lo mandamos al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta exige un rol y el usuario no lo tiene, lo mandamos a su inicio
  if (rolRequerido && rol !== rolRequerido) {
    return (
      <Navigate
        to={rol === "creador" ? "/creador/dashboard" : "/seguidor/feed"}
        replace
      />
    );
  }

  // 3. Si todo está bien, mostramos el Navbar y el contenido de la página (Outlet)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Outlet es el espacio donde se renderizará el componente hijo (ej. DashboardCreador) */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Sin Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas Privadas para CREADORES */}
        <Route element={<RutaProtegida rolRequerido="creador" />}>
          <Route path="/creador/dashboard" element={<DashboardCreador />} />
          <Route path="/creador/reporte" element={<ReporteIngresos />} />
        </Route>

        {/* Rutas Privadas para SEGUIDORES */}
        <Route element={<RutaProtegida rolRequerido="seguidor" />}>
          <Route path="/seguidor/feed" element={<FeedSeguidor />} />
          <Route path="/seguidor/lista" element={<ListaCreadores />} />
          <Route path="/seguidor/creador/:creadorId" element={<PerfilCreador />} />
          <Route path="/seguidor/historial" element={<HistorialSeguidor />} />
        </Route>

        {/* Rutas por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="*"
          element={
            <div className="p-10 text-red-500 text-center">
              404 - Página no encontrada
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
