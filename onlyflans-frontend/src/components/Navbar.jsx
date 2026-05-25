import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Rss,
  Users,
  Clock,
  BarChart3,
} from "lucide-react";
import onlyFlansLogo from "../assets/onlyflanslogo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const rol = localStorage.getItem("rol");
  const nombre = localStorage.getItem("nombre");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const enlacesCreador = [
    {
      nombre: "Mi Panel",
      ruta: "/creador/dashboard",
      icono: <LayoutDashboard size={18} />,
    },
    {
      nombre: "Mis Ingresos",
      ruta: "/creador/reporte",
      icono: <BarChart3 size={18} />,
    },
  ];

  const enlacesSeguidor = [
    { nombre: "Mi Feed", ruta: "/seguidor/feed", icono: <Rss size={18} /> },
    {
      nombre: "Explorar Creadores",
      ruta: "/seguidor/lista",
      icono: <Users size={18} />,
    },
    {
      nombre: "Mi Historial",
      ruta: "/seguidor/historial",
      icono: <Clock size={18} />,
    },
  ];

  const enlaces = rol === "creador" ? enlacesCreador : enlacesSeguidor;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={rol === "creador" ? "/creador/dashboard" : "/seguidor/feed"}
              className="flex items-center gap-2"
            >
              <img
                src={onlyFlansLogo}
                alt="OnlyFlans"
                className="h-8 w-auto object-contain"
                style={{ height: "150px", width: "auto" }}
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    location.pathname === enlace.ruta
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {enlace.icono}
                  {enlace.nombre}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Hola, <span className="font-bold text-gray-900">{nombre}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
              >
                <LogOut size={16} />
                Salir
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-4 pb-3 space-y-1">
            <p className="px-3 text-sm font-medium text-gray-500 mb-2">
              Conectado como{" "}
              <span className="font-bold text-gray-900">{nombre}</span>
            </p>

            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === enlace.ruta
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {enlace.icono}
                {enlace.nombre}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full mt-4 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
