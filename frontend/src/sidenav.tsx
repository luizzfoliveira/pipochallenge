import { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { FiHome, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { AiFillSwitcher } from "react-icons/ai";
import { BsTable } from "react-icons/bs";
import {
  FaUserCog,
  FaDownload,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import { MdLogout, MdOutlineAddCircle } from "react-icons/md";
import "react-pro-sidebar/dist/css/styles.css";
import "./sidenav.css";
import { Link, useNavigate } from "react-router-dom";
import {
  BASEURL,
  delSessionEmpresa,
  delSessionToken,
  getSessionEmpresa,
  getSessionToken,
} from "./utils";
import axios from "axios";

function Sidenav({ children }: any) {
  const [menuCollapse, setMenuCollapse] = useState(false);

  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  const navigate = useNavigate();

  function menuIconClick() {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  }

  function handleLogOut() {
    delSessionToken();
    delSessionEmpresa();
    navigate("/", { replace: true });
  }

  function handleNavigate() {
    navigate("/update_usuario");
  }

  function handleDownload() {
    axios({
      url: `${BASEURL}/api/tabela?empresa=${empresa}`,
      method: "GET",
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Untitled.csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  return (
    <div>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <Menu>
              <MenuItem active={true} icon={<FiHome />}>
                Área da Empresa
                <Link to="/area_empresa" />
              </MenuItem>
              <MenuItem active={true} icon={<MdOutlineAddCircle />}>
                Gerenciar Planos
                <Link to="/gerenciar_planos" />
              </MenuItem>
            </Menu>
            <div className="closemenu" onClick={menuIconClick}>
              {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem icon={<FaUserPlus />}>
                Novo
                <Link to="/novo_usuario" />
              </MenuItem>
              <MenuItem onClick={handleNavigate} icon={<FaUserCog />}>
                Update
                <Link to="/update_usuario" />
              </MenuItem>
              <MenuItem icon={<FaUserEdit />}>
                Alterar
                <Link to="/alterar_usuario" />
              </MenuItem>
              <MenuItem icon={<FaUserMinus />}>
                Deletar Usuário
                <Link to="/delete_usuario" />
              </MenuItem>
              <MenuItem icon={<AiFillSwitcher />}>
                Deletar Plano(s)
                <Link to="/delete_planos" />
              </MenuItem>
              <hr className="solid" />
              <MenuItem icon={<BsTable />}>
                Inicializar
                <Link to="/init_db" />
              </MenuItem>
              <MenuItem onClick={handleDownload} icon={<FaDownload />}>
                Baixar
              </MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem onClick={handleLogOut} icon={<MdLogout />}>
                LogOut
              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
      <div>{children}</div>
    </div>
  );
}
export default Sidenav;
