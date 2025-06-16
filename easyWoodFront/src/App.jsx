import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Login } from "./Views/Login/Login";
import { ClientDashboard } from "./Views/ClientDashboard/ClientDashboard.jsx";
import { MerchantDashboard } from "./Views/MerchantDashboard/MerchantDashboard.jsx";
import { ProtectedRoutes } from "./components/ProtectedRoutes.jsx";
import ActiveOrders from "./Views/Client/ActiveOrders";
import OrderHistory from "./Views/Client/OrderHistory";
import OrderDetail from "./Views/Client/OrderDetail";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Rota padrão continua sendo o Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas do Cliente */}
        <Route
          path="/dashboard-cliente"
          element={
            <ProtectedRoutes allowedRoles={["client"]}>
              <ClientDashboard />
              <Outlet /> {/* Adicione isto para renderizar as sub-rotas */}
            </ProtectedRoutes>
          }
        >
          <Route index element={<ActiveOrders />} />
          <Route path="pedidos" element={<ActiveOrders />} />
          <Route path="historico" element={<OrderHistory />} />
          <Route path="pedidos/:id" element={<OrderDetail />} />
        </Route>

        {/* Rota protegida para prestador */}
        <Route
          path="/dashboard-prestador"
          element={
            <ProtectedRoutes allowedRoles={["merchant"]}>
              <MerchantDashboard />
            </ProtectedRoutes>
          }
        />

        {/* Rota para páginas não encontradas (opcional) */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;