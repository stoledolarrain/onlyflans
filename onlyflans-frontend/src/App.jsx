import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DashboardCreador from "./pages/DashboardCreador";
import FeedSeguidor from "./pages/FeedSeguidor";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/creador/dashboard" element={<DashboardCreador />} />
          <Route path="/seguidor/feed" element={<FeedSeguidor />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="*"
            element={
              <div className="p-10 text-red-500">Página no encontrada</div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
