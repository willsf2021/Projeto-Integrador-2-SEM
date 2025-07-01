import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Login } from "./Views/Login/Login";
import { ClientDashboard } from "./Views/Client/ClientDashboard.jsx";
import { MerchantDashboard } from "./Views/Merchant/MerchantDashboard.jsx";
import { ProtectedRoutes } from "./components/ProtectedRoutes.jsx";
import ActiveOrders from "./Views/Client/components/ActiveOrders.jsx";
import OrderHistory from "./Views/Client/components/OrderHistory.jsx";
import OrderDetail from "./Views/Client/components/OrderDetail.jsx";
import MerchantActiveOrders from "./Views/Merchant/components/ActiveOrders.jsx";
import MerchantOrderHistory from "./Views/Merchant/components/OrderHistory.jsx";
import MerchantOrderDetail from "./Views/Merchant/components/OrderDetails.jsx";
import CreateOrder from "./Views/Merchant/components/CreateOrder.jsx";
import MaterialManager from "./Views/Merchant/components/InventoryView/MaterialManager.jsx";
import { Register } from "./Views/Register/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard-cliente"
          element={
            <ProtectedRoutes allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<ActiveOrders />} />
          <Route path="pedidos" element={<ActiveOrders />} />
          <Route path="historico" element={<OrderHistory />} />
          <Route path="pedidos/:id" element={<OrderDetail />} />
        </Route>

        <Route
          path="/dashboard-prestador"
          element={
            <ProtectedRoutes allowedRoles={["merchant"]}>
              <MerchantDashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<MerchantActiveOrders />} />
          <Route path="pedidos" element={<MerchantActiveOrders />} />
          <Route path="historico" element={<MerchantOrderHistory />} />
          <Route path="pedidos/:id" element={<MerchantOrderDetail />} />
          <Route path="criar-pedido" element={<CreateOrder />} />
        </Route>
        <Route
          path="/estoque"
          element={
            <ProtectedRoutes allowedRoles={["merchant"]}>
              <MaterialManager />
            </ProtectedRoutes>
          }
        ></Route>

        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
