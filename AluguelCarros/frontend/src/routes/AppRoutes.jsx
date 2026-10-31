import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Layout from "../components/Layout.jsx";
import Login from "../pages/Login.jsx";
import Cadastro from "../pages/Cadastro.jsx";
import Home from "../pages/Home.jsx";
import Perfil from "../pages/Perfil.jsx";
import Pedidos from "../pages/Pedidos.jsx";
import NovoPedido from "../pages/NovoPedido.jsx";
import PedidoDetalhe from "../pages/PedidoDetalhe.jsx";
import Automoveis from "../pages/Automoveis.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedidos/:id" element={<PedidoDetalhe />} />

          <Route element={<ProtectedRoute papel="CLIENTE" />}>
            <Route path="/pedidos/novo" element={<NovoPedido />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route element={<ProtectedRoute papel="AGENTE" />}>
            <Route path="/automoveis" element={<Automoveis />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
