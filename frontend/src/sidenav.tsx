import { useState } from "react"; //react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar"; //icons from react icons
import {
  FiHome,
  FiLogOut,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { GrTableAdd } from "react-icons/gr";
import {
  FaUserCog,
  FaDownload,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import { SiApacheairflow } from "react-icons/si";
import { MdLogout } from "react-icons/md";
import { GiAbstract050 } from "react-icons/gi"; //sidebar css from react-pro-sidebar module
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
    <div
      style={
        {
          // display: "flex",
          // justifyContent: "space-between",
          // alignContent: "space-around",
        }
      }
    >
      <div id="header">
        {/* collapsed props to change menu size using menucollapse state */}
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="logotext">
              {/* Icon change using menucollapse state */}
              <p>{menuCollapse ? <GiAbstract050 /> : <SiApacheairflow />}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ProSidebar>
              <Menu iconShape="square">
                <MenuItem active={true} icon={<FiHome />}>
                  Área da Empresa
                  <Link to="/area_empresa" />
                </MenuItem>
                <hr className="solid" />
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
                  Deletar
                  <Link to="/delete_usuario" />
                </MenuItem>
                <hr className="solid" />
                <MenuItem icon={<GrTableAdd />}>
                  Inicializar
                  <Link to="/init_db" />
                </MenuItem>
                <MenuItem onClick={handleDownload} icon={<FaDownload />}>
                  Baixar
                </MenuItem>
                <hr className="solid" />
                <MenuItem onClick={handleLogOut} icon={<MdLogout />}>
                  LogOut
                </MenuItem>
              </Menu>
            </ProSidebar>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}
export default Sidenav;
