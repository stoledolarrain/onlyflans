import { useState, useEffect } from "react";
import { Clock, Award, Calendar } from "lucide-react";
import api from "../services/api";

export default function HistorialSeguidor() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState("");

  useEffect(() => {
    // Llamamos a tu ruta del backend que trae el historial del seguidor
    api
      .get("/donaciones/historial")
      .then((response) => {
        setHistorial(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar el historial:", error);
        setErrorGlobal("No se pudo cargar tu historial de donaciones.");
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Clock className="animate-spin mb-4 text-amber-500" size={32} />
        <p className="font-medium">Cargando tu historial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
      {/* Cabecera */}
      <div className="mb-8 border-b pb-4 flex items-center gap-3">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
          <Clock size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Mi Historial
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Revisa a qué creadores has apoyado con tus flanes.
          </p>
        </div>
      </div>

      {errorGlobal && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorGlobal}
        </div>
      )}

      {/* Tabla de Historial */}
      {historial.length === 0 && !errorGlobal ? (
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <Award size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-800">
            Aún no has donado flanes
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Explora la lista de creadores y anímate a invitarlos un flan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Fecha</th>
                  <th className="p-4 font-bold">Creador Apoyado</th>
                  <th className="p-4 font-bold text-center">Flanes Donados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historial.map((donacion) => {
                  // Extracción segura del nombre del creador al que le donó
                  const infoCreador =
                    donacion.creador ||
                    donacion.Creador ||
                    donacion.receptor ||
                    {};

                  return (
                    <tr
                      key={donacion.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(donacion.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900">
                        {infoCreador.nombre || "Creador"}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                          {donacion.cantidadFlanes} 🍮
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
