import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  BASEURL,
  delSessionEmpresa,
  delSessionToken,
  getSessionEmpresa,
  getSessionToken,
} from "./utils";
import axios from "axios";

export default function UsuariosLayout({ children }: any) {
  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  const navigate = useNavigate();

  function handleLogOut() {
    delSessionToken();
    delSessionEmpresa();
    navigate("/");
  }

  function handleDownload() {
    axios({
      url: `${BASEURL}/api/table?empresa=${empresa}`,
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
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/area_empresa">
            <img
              src="https://global-uploads.webflow.com/5ee0d13e1d0466f2353dcb99/604b853988008d3835ce3dc5_Logo%20%E2%80%93%20Pipo%20Sau%CC%81de.svg"
              loading="lazy"
              alt=""
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/area_empresa">Home</Nav.Link>
            <Nav.Link href="/novo_usuario">Novo</Nav.Link>
            <Nav.Link href="/update_usuario">Update</Nav.Link>
            <Nav.Link href="/alterar_usuario">Alterar</Nav.Link>
            <Nav.Link href="/delete_usuario">Delete</Nav.Link>
            <Nav.Link href="/init_db">Inicializar DB</Nav.Link>
          </Nav>
          <Button onClick={handleDownload}>Download</Button>
          <Button onClick={handleLogOut}>Log Out</Button>
        </Container>
      </Navbar>
      {children}
    </>
  );
}
