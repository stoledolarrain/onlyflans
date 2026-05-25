import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import api from "../services/api";

// --- SUB-COMPONENTE: Maneja el input de comentario para cada post individualmente ---
function CajaComentario({ postId, onComentarioEnviado }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return; // Evita enviar comentarios vacíos

    setEnviando(true);
    try {
      // Usamos los campos exactos de tu interaccion.schema.js
      await api.post("/interacciones/comentar", { postId, texto });
      setTexto(""); // Limpiamos el input
      onComentarioEnviado(); // Le avisamos al componente padre que recargue el feed
    } catch (error) {
      console.error("Error al comentar:", error);
      alert("Hubo un error al enviar tu comentario.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe un comentario..."
        className="flex-1 bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={enviando}
      />
      <button
        type="submit"
        disabled={enviando || !texto.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        <Send size={16} />
      </button>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL: El Feed del Seguidor ---
export default function FeedSeguidor() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState("");

  const cargarFeed = () => {
    // Petición a la ruta de tu backend que trae el feed
    api
      .get("/posts/feed")
      .then((response) => {
        setPosts(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Detalle del error:", error);
        setErrorGlobal("No se pudo cargar el feed de publicaciones.");
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarFeed();
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Clock className="animate-spin mb-4 text-blue-600" size={32} />
        <p className="font-medium">Cargando publicaciones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12 space-y-6">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Tu Feed</h1>
        <p className="text-gray-600 text-sm mt-1">
          Descubre las últimas novedades de los creadores.
        </p>
      </div>

      {errorGlobal && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorGlobal}
        </div>
      )}

      {posts.length === 0 && !errorGlobal ? (
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-800">
            No hay publicaciones aún
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Parece que ningún creador ha subido contenido todavía o aún no
            sigues a nadie. ¡Explora creadores y apóyalos!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            // --- EXTRACCIÓN SEGURA DE DATOS DEL CREADOR ---
            // Revisamos todas las posibles formas en las que Sequelize envía los datos
            const infoCreador =
              post.creador ||
              post.Creador ||
              post.Usuario ||
              post.usuario ||
              {};
            const fotoCreador =
              infoCreador.fotoUrl ||
              infoCreador.Perfil?.fotoUrl ||
              infoCreador.perfil?.fotoUrl ||
              null;

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5 flex items-center gap-3 border-b border-gray-50">
                  <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {fotoCreador ? (
                      <img
                        src={fotoCreador}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {infoCreador.nombre || "Creador Desconocido"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* --- Contenido del Post --- */}
                <div className="p-5">
                  {post.texto && (
                    <p className="text-gray-800 text-base mb-4 leading-relaxed">
                      {post.texto}
                    </p>
                  )}
                  {post.imagenUrl && (
                    <img
                      src={post.imagenUrl}
                      alt="Contenido de la publicación"
                      className="w-full rounded-xl object-cover max-h-96 border border-gray-100"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                {/* --- Sección de Comentarios --- */}
                <div className="bg-gray-50 p-5 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                    <MessageSquare size={16} />
                    Comentarios ({post.Comentarios?.length || 0})
                  </h4>

                  {/* --- CORRECCIÓN AQUÍ: Extracción segura de la lista de comentarios --- */}
                  {(post.Comentarios && post.Comentarios.length > 0) ||
                  (post.comentarios && post.comentarios.length > 0) ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {/* Mapeamos la lista correcta, ya sea "Comentarios" o "comentarios" */}
                      {(post.Comentarios || post.comentarios).map(
                        (comentario) => {
                          // Extracción segura del autor del comentario
                          const autorComentario =
                            comentario.autor ||
                            comentario.Autor ||
                            comentario.Usuario ||
                            comentario.usuario ||
                            {};

                          return (
                            <div
                              key={comentario.id}
                              className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                            >
                              <span className="font-bold text-xs text-gray-900 block mb-0.5">
                                {autorComentario.nombre || "Usuario"}
                              </span>
                              <p className="text-gray-700 text-sm">
                                {comentario.texto}
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Sé el primero en comentar.
                    </p>
                  )}

                  {/* Input para comentar (Sub-componente) */}
                  <CajaComentario
                    postId={post.id}
                    onComentarioEnviado={cargarFeed}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
