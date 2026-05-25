import { useState, useEffect } from "react";
import { Search, User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ListaCreadores() {
  const [creadores, setCreadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reemplaza "/creadores" si tu ruta en el backend se llama diferente
    api.get("/creadores/lista")
      .then((response) => {
        setCreadores(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar creadores:", error);
        setError("No se pudo cargar la lista de creadores.");
        setCargando(false);
      });
  }, []);

  // Lógica de búsqueda en tiempo real (Frontend)
  const creadoresFiltrados = creadores.filter((creador) =>
    creador.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-8">
      
      {/* Cabecera y Buscador */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Explorar Creadores</h1>
        <p className="text-gray-600 text-sm mb-6">
          Encuentra a tus creadores favoritos y apóyalos con flanes.
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre de creador..."
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm font-medium"
          />
        </div>
      </div>

      {/* Lista/Grid de Creadores */}
      {cargando ? (
        <p className="text-center text-gray-500 py-10 font-medium">Buscando creadores...</p>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium text-center border border-red-100">
          {error}
        </div>
      ) : creadoresFiltrados.length === 0 ? (
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <p className="text-gray-500 font-medium">No se encontraron creadores con ese nombre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {creadoresFiltrados.map((creador) => (
            <Link
              key={creador.id}
              to={`/seguidor/creador/${creador.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group flex flex-col"
            >
              {/* Mini Banner (z-0 para que se quede al fondo) */}
              <div className="h-24 bg-amber-100 w-full relative z-0">
                {creador.bannerUrl && (
                  <img src={creador.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              
              {/* Info (Avatar y Nombre) - ¡z-10 y relative para que suba por encima del banner! */}
              <div className="px-5 pb-6 flex flex-col items-center -mt-10 flex-1 relative z-10">
                
                {/* Contenedor del Avatar */}
                <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md border-2 border-white overflow-hidden mb-3 flex items-center justify-center">
                  {creador.fotoUrl ? (
                    <img src={creador.fotoUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg text-center leading-tight mb-1">
                  {creador.nombre}
                </h3>
                <p className="text-xs text-gray-500 text-center line-clamp-2 mb-4">
                  {creador.descripcion || "Creador de contenido en OnlyFlans"}
                </p>

                <div className="mt-auto w-full pt-4 border-t border-gray-50 flex items-center justify-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Ver perfil <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}