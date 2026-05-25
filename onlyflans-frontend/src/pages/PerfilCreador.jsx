import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Target,
  ArrowLeft,
  Heart,
  Award,
  Star,
  MessageSquare,
} from "lucide-react";
import api from "../services/api";

export default function PerfilCreador() {
  const { creadorId } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();

  const [creador, setCreador] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [donando, setDonando] = useState(false);
  const [siguiendo, setSiguiendo] = useState(false); // Estado para controlar si ya se sigue al creador

  // Función para obtener el perfil del creador y actualizar posts desbloqueados si ya donó
  const cargarPerfil = () => {
    api
      .get(`/creadores/${creadorId}`)
      .then((response) => {
        setCreador(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar perfil:", error);
        setErrorGlobal("No se pudo cargar el perfil del creador.");
        setCargando(false);
      });
  };

  // Función para comprobar si este creador específico ya está en la lista de favoritos del seguidor
  const verificarSiLoSigo = async () => {
    try {
      const response = await api.get("/interacciones/favoritos");
      // Buscamos si el ID de este creador coincide con algún registro en el array de favoritos
      const loSigo = response.data.some(
        (fav) =>
          fav.id === parseInt(creadorId) ||
          fav.creadorId === parseInt(creadorId),
      );
      setSiguiendo(loSigo);
    } catch (error) {
      console.error("Error al verificar favoritos:", error);
    }
  };

  useEffect(() => {
    cargarPerfil();
    verificarSiLoSigo();
  }, [creadorId]);

  // Función para enviar la donación de flanes
  const handleDonar = async (cantidad) => {
    setDonando(true);
    setMensajeExito("");
    setErrorGlobal("");

    try {
      await api.post("/donaciones", {
        creadorId: parseInt(creadorId),
        cantidadFlanes: cantidad,
      });

      setMensajeExito(`¡Increíble! Has donado ${cantidad} flan(es) con éxito.`);
      // Volvemos a pedir el perfil para que el backend nos devuelva la lista de posts liberados al instante
      cargarPerfil();
    } catch (error) {
      console.error(error);
      setErrorGlobal(
        error.response?.data?.message ||
          "Hubo un error al procesar tu donación.",
      );
    } finally {
      setDonando(false);
    }
  };

  // Función toggle para seguir o dejar de seguir mediante favoritos (Ruta /interacciones/favorito)
  const handleFavorito = async () => {
    try {
      await api.post("/interacciones/favorito", {
        creadorId: parseInt(creadorId),
      });
      // Invertimos el estado visualmente al instante
      setSiguiendo(!siguiendo);
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
    }
  };

  if (cargando) {
    return (
      <p className="text-center py-20 text-gray-500 font-medium">
        Cargando perfil del creador...
      </p>
    );
  }

  if (!creador || !creador.creador) {
    return (
      <p className="text-center py-20 text-red-500 font-medium">
        Creador no encontrado.
      </p>
    );
  }

  // Estructura de extracción limpia mapeada según la respuesta de tu backend
  const infoUsuario = creador.creador;
  const perfilInfo = infoUsuario.Perfil || {};
  const metaActiva =
    infoUsuario.Meta && infoUsuario.Meta.length > 0
      ? infoUsuario.Meta[0]
      : null;
  const postsDesbloqueados = creador.posts || [];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 space-y-6">
      {/* Barra de controles superiores */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a explorar
        </button>

        {/* BOTÓN DINÁMICO: Cambia de estilo y texto según el estado de la suscripción */}
        <button
          onClick={handleFavorito}
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors border ${
            siguiendo
              ? "text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200"
              : "text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200"
          }`}
        >
          <Star
            size={16}
            className={
              siguiendo
                ? "fill-gray-400 text-gray-400"
                : "fill-amber-500 text-amber-500"
            }
          />
          {siguiendo ? "Dejar de seguir" : "Seguir Creador"}
        </button>
      </div>

      {/* --- PANEL DE PERFIL (Banner y Avatar) --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-44 w-full bg-amber-100 relative z-0">
          {perfilInfo.bannerUrl && (
            <img
              src={perfilInfo.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-8 pb-8 relative z-10 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
          <div className="h-32 w-32 rounded-full bg-white p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center flex-shrink-0">
            {perfilInfo.fotoUrl ? (
              <img
                src={perfilInfo.fotoUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center">
                <User size={60} className="text-gray-300" />
              </div>
            )}
          </div>

          <div className="mb-4 sm:mb-0 flex-1">
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              {infoUsuario.nombre}
            </h1>
            <p className="text-gray-600 text-sm mt-1.5 max-w-xl">
              {perfilInfo.descripcion || "Creador de contenido en OnlyFlans"}
            </p>
          </div>
        </div>
      </div>

      {/* Alertas de éxito o error */}
      {mensajeExito && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-bold border border-green-200 flex items-center gap-2 shadow-sm">
          <Heart size={18} className="text-green-600" />
          {mensajeExito}
        </div>
      )}
      {errorGlobal && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-bold border border-red-200">
          {errorGlobal}
        </div>
      )}

      {/* --- PANEL DE DOS COLUMNAS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* COLUMNA DE METAS */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-extrabold text-black flex items-center gap-2.5 text-lg border-b border-gray-50 pb-4 mb-4">
            <Target size={22} className="text-blue-600" />
            Meta de Apoyo Actual
          </h2>

          {metaActiva ? (
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
              <h4 className="font-bold text-blue-900 text-base mb-2">
                {metaActiva.titulo}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {metaActiva.descripcion}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-5 rounded-2xl">
              Este creador aún no ha definido una meta de apoyo específica,
              ¡pero tu contribución siempre ayuda!
            </p>
          )}
        </div>

        {/* COLUMNA DE INTERACCIÓN / DONACIÓN */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-extrabold text-black flex items-center gap-2.5 text-lg border-b border-gray-50 pb-4 mb-6">
            <Award size={22} className="text-amber-500" />
            Invitar Flanes
          </h2>

          <p className="text-sm text-gray-600 mb-6 font-medium">
            ¡Demuestra tu apoyo a{" "}
            <span className="font-bold text-black">{infoUsuario.nombre}</span>{" "}
            regalándole unos flanes!
          </p>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleDonar(1)}
              disabled={donando}
              className="flex flex-col items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4 transition-all disabled:opacity-50 hover:scale-105"
            >
              <span className="text-3xl">🍮</span>
              <span className="font-bold text-sm">1 Flan</span>
            </button>

            <button
              onClick={() => handleDonar(5)}
              disabled={donando}
              className="flex flex-col items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4 transition-all disabled:opacity-50 hover:scale-105"
            >
              <span className="text-3xl">🍮🍮</span>
              <span className="font-bold text-sm">5 Flanes</span>
            </button>

            <button
              onClick={() => handleDonar(10)}
              disabled={donando}
              className="flex flex-col items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl p-4 transition-all disabled:opacity-50 hover:scale-105"
            >
              <span className="text-3xl">🥧</span>
              <span className="font-bold text-sm">10 Flanes</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR: FEED INTEGRADO DEL PERFIL --- */}
      {creador.accesoDesbloqueado ? (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-extrabold text-gray-900 border-b pb-2 flex items-center gap-2">
            <MessageSquare className="text-blue-600" /> Contenido Exclusivo
          </h3>

          {postsDesbloqueados.length === 0 ? (
            <p className="text-gray-500 text-center bg-white p-8 rounded-2xl border border-gray-100">
              Este creador no ha publicado contenido aún.
            </p>
          ) : (
            <div className="space-y-6">
              {postsDesbloqueados.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <span className="text-xs font-semibold text-gray-400 mb-2 block uppercase tracking-wider">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.texto && (
                      <p className="text-gray-900 text-lg mb-4 leading-relaxed">
                        {post.texto}
                      </p>
                    )}
                    {post.imagenUrl && (
                      <img
                        src={post.imagenUrl}
                        alt="Contenido"
                        className="w-full rounded-2xl object-cover max-h-96 border border-gray-100"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center bg-gray-50 border border-gray-200 rounded-3xl p-10 mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Contenido Bloqueado 🔒
          </h3>
          <p className="text-sm text-gray-500">
            Apoya a este creador con flanes para desbloquear sus publicaciones.
          </p>
        </div>
      )}
    </div>
  );
}
