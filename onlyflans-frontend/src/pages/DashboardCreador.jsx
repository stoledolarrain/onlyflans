import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Image as ImageIcon,
  Send,
  MessageSquare,
  User,
  Target,
  Edit2,
} from "lucide-react";
import api from "../services/api";

export default function DashboardCreador() {
  const [posts, setPosts] = useState([]);
  const [perfil, setPerfil] = useState({
    descripcion: "",
    fotoUrl: "",
    bannerUrl: "",
  });
  const [meta, setMeta] = useState({ titulo: "", descripcion: "" });

  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [editandoMeta, setEditandoMeta] = useState(false);

  const nombreUsuario = localStorage.getItem("nombre") || "Creador";

  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    reset: resetPost,
    formState: { isSubmitting: subiendoPost },
  } = useForm();
  const {
    register: registerPerfil,
    handleSubmit: handleSubmitPerfil,
    reset: resetFormPerfil,
  } = useForm();
  const {
    register: registerMeta,
    handleSubmit: handleSubmitMeta,
    reset: resetFormMeta,
  } = useForm();

  // --- CORRECCIÓN DE CARGA INICIAL ---
  useEffect(() => {
    Promise.all([
      api.get("/posts/mis-posts"),
      // Llamamos a la nueva ruta que acabamos de crear en el backend
      api.get("/creadores/mi-perfil").catch(() => ({ data: null })),
    ])
      .then(([resPosts, resPerfil]) => {
        setPosts(resPosts.data);

        // Extraemos la información del perfil y la meta de forma segura
        if (resPerfil.data && resPerfil.data.creador) {
          const infoUsuario = resPerfil.data.creador;
          const perfilInfo = infoUsuario.Perfil || {
            descripcion: "",
            fotoUrl: "",
            bannerUrl: "",
          };
          const metaActiva =
            infoUsuario.Meta && infoUsuario.Meta.length > 0
              ? infoUsuario.Meta[0]
              : { titulo: "", descripcion: "" };

          setPerfil(perfilInfo);
          resetFormPerfil(perfilInfo);

          if (metaActiva.titulo) {
            setMeta(metaActiva);
            resetFormMeta(metaActiva);
          }
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al inicializar los datos:", error);
        setCargando(false);
      });
  }, [resetFormPerfil, resetFormMeta]);

  const onSubmitPost = async (data) => {
    if (!data.texto && !data.imagenUrl) {
      setErrorGlobal("Tu publicación debe tener al menos texto o una imagen.");
      return;
    }
    setErrorGlobal("");
    try {
      await api.post("/posts", data);
      resetPost();
      const response = await api.get("/posts/mis-posts");
      setPosts(response.data);
    } catch (error) {
      setErrorGlobal(error.response?.data?.message || "Error al publicar.");
    }
  };

  // --- CORRECCIÓN DE GUARDADO DE PERFIL ---
  const onSubmitPerfil = async (data) => {
    try {
      const response = await api.put("/creadores/perfil", data);
      // El backend devuelve { message: "...", perfil: {...} }, extraemos solo el perfil
      setPerfil(response.data.perfil || data);
      setEditandoPerfil(false);
    } catch (error) {
      console.error(error);
      setErrorGlobal("No se pudo actualizar el perfil.");
    }
  };

  const onSubmitMeta = async (data) => {
    try {
      const response = await api.post("/creadores/metas", data);
      setMeta(response.data.meta || response.data);
      setEditandoMeta(false);
      setErrorGlobal("");
    } catch (error) {
      console.error(error);
      setErrorGlobal("No se pudo guardar la meta de apoyo.");
    }
  };

  if (cargando) {
    return (
      <p className="text-center text-gray-600 py-20 font-medium">
        Cargando tu panel de control...
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 space-y-6">
      {/* --- PANEL DE PERFIL --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-44 w-full bg-amber-100 relative z-0">
          {perfil.bannerUrl && (
            <img
              src={perfil.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-8 pb-8 relative z-10 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
          <div className="h-32 w-32 rounded-full bg-white p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">
            {perfil.fotoUrl ? (
              <img
                src={perfil.fotoUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center">
                <User size={60} className="text-gray-300" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center sm:items-end w-full sm:w-auto">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-extrabold text-black tracking-tight">
                {nombreUsuario}
              </h1>
              <p className="text-gray-600 text-sm mt-1.5 max-w-xl">
                {perfil.descripcion ||
                  "Aún no has añadido una descripción. Haz clic en 'Editar Perfil' para que tus seguidores sepan quién eres."}
              </p>
            </div>
            <button
              onClick={() => setEditandoPerfil(!editandoPerfil)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex-shrink-0"
            >
              <Edit2 size={16} /> Editar Perfil
            </button>
          </div>
        </div>

        {editandoPerfil && (
          <form
            onSubmit={handleSubmitPerfil(onSubmitPerfil)}
            className="p-8 border-t border-gray-100 bg-gray-50 space-y-4"
          >
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
              Ajustes del Perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Foto de Perfil (Avatar)
                </label>
                <input
                  type="url"
                  {...registerPerfil("fotoUrl")}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                  placeholder="https://ejemplo.com/mifoto.jpg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Banner de Fondo
                </label>
                <input
                  type="url"
                  {...registerPerfil("bannerUrl")}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                  placeholder="https://ejemplo.com/mibanner.png"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Sobre ti (Descripción)
              </label>
              <textarea
                {...registerPerfil("descripcion")}
                rows="2"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm resize-none"
                placeholder="Cuéntale a tus seguidores quién eres..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditandoPerfil(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Guardar Perfil
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: META DE APOYO */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4 lg:sticky lg:top-24">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h2 className="font-extrabold text-black flex items-center gap-2.5 text-base">
              <Target size={20} className="text-blue-600" />
              Meta de Apoyo
            </h2>
            <button
              onClick={() => setEditandoMeta(!editandoMeta)}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
            >
              <Edit2 size={10} /> Gestionar
            </button>
          </div>

          {editandoMeta ? (
            <form
              onSubmit={handleSubmitMeta(onSubmitMeta)}
              className="space-y-3 pt-2"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Título de la Meta
                </label>
                <input
                  type="text"
                  {...registerMeta("titulo", { required: true })}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Ej: Nueva cámara web"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...registerMeta("descripcion", { required: true })}
                  rows="3"
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none"
                  placeholder="Explica a tus seguidores por qué es importante..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEditandoMeta(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md"
                >
                  Omitir
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md"
                >
                  Fijar Meta
                </button>
              </div>
            </form>
          ) : meta.titulo ? (
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <h4 className="font-bold text-blue-900 text-sm mb-1">
                {meta.titulo}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {meta.descripcion}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-2 text-center">
              No has establecido ninguna meta de apoyo activa todavía.
            </p>
          )}
        </div>

        {/* COLUMNA CENTRAL/DERECHA: CREAR POSTS Y FEED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-base font-extrabold text-black mb-4">
              Crear nueva publicación
            </h2>
            {errorGlobal && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs font-medium border border-red-100">
                {errorGlobal}
              </div>
            )}

            <form
              onSubmit={handleSubmitPost(onSubmitPost)}
              className="space-y-4"
            >
              <textarea
                {...registerPost("texto")}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none bg-gray-50/50"
                placeholder="¿Qué quieres compartir con tus seguidores hoy?"
              ></textarea>
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 flex items-center gap-2.5 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                  <ImageIcon size={20} className="text-gray-400" />
                  <input
                    type="url"
                    {...registerPost("imagenUrl")}
                    className="w-full bg-transparent border-none focus:outline-none text-xs font-medium"
                    placeholder="URL de tu imagen (Opcional)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subiendoPost}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {subiendoPost ? "Publicando..." : "Publicar"}{" "}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-black border-b border-gray-50 pb-1.5">
              Mis Publicaciones
            </h3>
            {posts.length === 0 ? (
              <div className="text-center bg-white rounded-3xl border border-gray-100 p-10 text-sm text-gray-500 font-medium">
                Aún no tienes publicaciones creadas. ¡Comparte tu primer post
                arriba!
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:border-gray-200/70 hover:shadow-md"
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
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                  </div>

                  <div className="bg-gray-50/70 p-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <MessageSquare size={14} /> Comentarios (
                      {post.Comentarios?.length || 0})
                    </h4>
                    {post.Comentarios && post.Comentarios.length > 0 ? (
                      <div className="space-y-3">
                        {post.Comentarios.map((c) => (
                          <div
                            key={c.id}
                            className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-xs"
                          >
                            <span className="font-bold text-gray-900 block mb-1">
                              {c.autor?.nombre}
                            </span>
                            <p className="text-gray-800 text-sm">{c.texto}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No hay comentarios en este post.
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
