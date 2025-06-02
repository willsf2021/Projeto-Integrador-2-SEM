import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Views/Login/Login";
import { ClientDashboard } from "./Views/ClientDashboard/ClientDashboard.jsx";
import { MerchantDashboard } from "./Views/MerchantDashboard/MerchantDashboard.jsx";
import { ProtectedRoutes } from "./components/ProtectedRoutes.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Rota padrão continua sendo o Login */}
        <Route path="/" element={<Login />} />

        {/* Nova rota para o dashboard do cliente */}
        <Route
          path="/dashboard-cliente"
          element={
            <ProtectedRoutes allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoutes>
          }
        />

        {/* Rota protegida para prestador */}
        <Route
          path="/dashboard-prestador"
          element={
            <ProtectedRoutes allowedRoles={["merchant"]}>
              <MerchantDashboard />
            </ProtectedRoutes>
          }
        />

        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;
