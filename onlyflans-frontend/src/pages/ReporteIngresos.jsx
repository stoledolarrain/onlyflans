import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";

export default function ReporteIngresos() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const cargarReporte = () => {
    setCargando(true);

    let url = "/creadores/reporte";
    const params = [];
    if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
    if (fechaFin) params.push(`fechaFin=${fechaFin}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    api
      .get(url)
      .then((response) => {
        setReporte(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar el reporte de ingresos:", error);
        setErrorGlobal("No se pudo obtener el reporte de ganancias.");
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  if (cargando && !reporte) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <TrendingUp className="animate-spin mb-4 text-blue-600" size={32} />
        <p className="font-medium">Calculando tus ingresos financieros...</p>
      </div>
    );
  }

  const totalFlanes = reporte?.totalFlanes || reporte?.total || 0;
  const donacionesLista = reporte?.donaciones || reporte?.historial || [];

  const ingresosEstimados = totalFlanes * 1;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 space-y-6">
      <div className="mb-8 border-b pb-4 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Reporte de Ingresos
          </h1>
        </div>
      </div>

      {errorGlobal && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorGlobal}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 text-2xl">
            🍮
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Recibido
            </span>
            <span className="text-3xl font-black text-gray-900">
              {totalFlanes} Flanes
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Balance Estimado
            </span>
            <span className="text-3xl font-black text-green-600">
              {ingresosEstimados}.00 Bs
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" /> Filtrar por periodo
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Fecha de Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={cargarReporte}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors w-full sm:w-auto h-[42px]"
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="p-6 pb-4 text-base font-extrabold text-gray-900 border-b border-gray-50">
          Historial de donaciones
        </h3>

        {donacionesLista.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 italic font-medium">
            No se registraron transacciones en este período.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Fecha</th>
                  <th className="p-4 font-bold">Seguidor</th>
                  <th className="p-4 font-bold text-center">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donacionesLista.map((donacion) => {
                  const infoSeguidor =
                    donacion.seguidor ||
                    donacion.Seguidor ||
                    donacion.donante ||
                    {};

                  return (
                    <tr
                      key={donacion.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(donacion.createdAt).toLocaleDateString()}{" "}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900">
                        {infoSeguidor.nombre || "Seguidor Anónimo"}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                          +{donacion.cantidadFlanes} 🍮
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
