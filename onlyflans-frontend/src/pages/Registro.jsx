import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import onlyFlansLogo from "../assets/onlyflanslogo.png";

const registerSchema = Joi.object({
  nombre: Joi.string().min(3).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Ingresa un correo válido",
      "string.empty": "El correo es obligatorio",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
  rol: Joi.string().valid("creador", "seguidor").required().messages({
    "any.only": "Debes seleccionar un rol válido",
  }),
});

export default function Registro() {
  const navigate = useNavigate();
  const [errorGlobal, setErrorGlobal] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      rol: "seguidor",
    },
  });

  const onSubmit = async (data) => {
    setErrorGlobal("");
    try {
      await api.post("/auth/register", data);

      setRegistroExitoso(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorGlobal(error.response.data.message);
      } else {
        setErrorGlobal("Error de conexión al registrar. Revisa tu backend.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 transition-all border border-gray-100">
        <div className="flex justify-center mb-6">
          <img
            src={onlyFlansLogo}
            alt="OnlyFlans Logo"
            className="w-40 object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-black tracking-tight">
          Crear Cuenta
        </h2>
        <br />

        {errorGlobal && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 mb-5 text-sm font-medium text-center">
            {errorGlobal}
          </div>
        )}

        {registroExitoso && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 mb-5 text-sm font-medium text-center">
            ¡Registro exitoso! Redirigiendo al Login...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              {...register("nombre")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 ${
                errors.nombre ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.nombre && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
              placeholder="tu@correo.com"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Que rol quisieras ocupar en OnlyFlans?
            </label>
            <select
              {...register("rol")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                errors.rol ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="seguidor">Quiero ser Seguidor</option>
              <option value="creador">Quiero ser Creador</option>
            </select>
            {errors.rol && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.rol.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || registroExitoso}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition disabled:opacity-50 text-lg shadow-sm"
            >
              {isSubmitting ? "Registrando..." : "Crear mi cuenta"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Inicia Sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
