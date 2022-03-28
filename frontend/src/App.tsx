import { Routes, Route, Outlet } from "react-router-dom";
import SignUp from "./login/signup";
import AreaUsuario from "./user-manipulation/area-empresa";
import DeleteUsuario from "./user-manipulation/delete-usuario";
import InitTabela from "./init-db/init-from-tabela";
import Login from "./login/login";
import ProtectedUserRoute from "./protect-user-route";
import Sidenav from "./sidenav";
import Layout from "./Layout";
import ProtectedLoginRoute from "./protect-login-route";
import Planos from "./Planos";
import UpdateUsuario from "./user-manipulation/update-usuario";
import NovoUsuario from "./user-manipulation/novo-usuario";
import AlterarUsuario from "./user-manipulation/alterar-usuario";
import DeletePlano from "./user-manipulation/delete-plano";
import ManipularPlanos from "./user-manipulation/planos";
import Home from "./Home";

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/planos" element={<Planos />} />
        <Route
          path="signup"
          element={
            <ProtectedLoginRoute>
              <SignUp />
            </ProtectedLoginRoute>
          }
        />
        <Route
          path="login"
          element={
            <ProtectedLoginRoute>
              <Login />
            </ProtectedLoginRoute>
          }
        />
        <Route
          element={
            <Sidenav>
              <ProtectedUserRoute>
                <Outlet />
              </ProtectedUserRoute>
            </Sidenav>
          }
        >
          <Route path="area_empresa" element={<AreaUsuario />} />
          <Route path="gerenciar_planos" element={<ManipularPlanos />} />
          <Route path="novo_usuario" element={<NovoUsuario />} />
          <Route path="update_usuario" element={<UpdateUsuario />} />
          <Route path="alterar_usuario" element={<AlterarUsuario />} />
          <Route path="delete_usuario" element={<DeleteUsuario />} />
          <Route path="delete_planos" element={<DeletePlano />} />
          <Route path="init_db" element={<InitTabela />} />
        </Route>
      </Route>
    </Routes>
  );
}
