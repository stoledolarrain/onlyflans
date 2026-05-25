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

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && rol !== rolRequerido) {
    return (
      <Navigate
        to={rol === "creador" ? "/creador/dashboard" : "/seguidor/feed"}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<RutaProtegida rolRequerido="creador" />}>
          <Route path="/creador/dashboard" element={<DashboardCreador />} />
          <Route path="/creador/reporte" element={<ReporteIngresos />} />
        </Route>

        <Route element={<RutaProtegida rolRequerido="seguidor" />}>
          <Route path="/seguidor/feed" element={<FeedSeguidor />} />
          <Route path="/seguidor/lista" element={<ListaCreadores />} />
          <Route
            path="/seguidor/creador/:creadorId"
            element={<PerfilCreador />}
          />
          <Route path="/seguidor/historial" element={<HistorialSeguidor />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="*"
          element={
            <div className="p-10 text-red-500 text-center">
              Pagina no encontrada
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
