import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import onlyFlansLogo from "../assets/onlyflanslogo.png";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Ingresa un correo válido",
      "string.empty": "El correo es obligatorio",
    }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
  }),
});

export default function Login() {
  const navigate = useNavigate();
  const [errorGlobal, setErrorGlobal] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setErrorGlobal("");
    try {
      const response = await api.post("/auth/login", data);
      const { token, rol, nombre } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("nombre", nombre);

      if (rol === "creador") {
        navigate("/creador/dashboard");
      } else {
        navigate("/seguidor/feed");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorGlobal(error.response.data.message);
      } else {
        setErrorGlobal("Error de conexión. Revisa tu backend.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 transition-all border border-gray-100">
        <div className="flex justify-center mb-6">
          <img
            src={onlyFlansLogo}
            alt="OnlyFlans Logo"
            className="w-40 object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-950 tracking-tight">
          Iniciar Sesión
        </h2>
        <br />

        {errorGlobal && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 mb-5 text-sm font-medium text-center">
            {errorGlobal}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Contraseña"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition disabled:opacity-50 text-lg shadow-sm"
            >
              {isSubmitting ? "Ingresando..." : "Entrar a OnlyFlans"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          ¿Aún no tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-600 hover:underline font-semibold"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
