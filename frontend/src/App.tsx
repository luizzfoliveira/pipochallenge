import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
// import { useState } from "react";
import SearchPlanos from "./user-manipulation/get-necessary-info/search-planos";
import AddPlano from "./plano-manipulation/add-plano";
import { Routes, Route } from "react-router-dom";
import { Operation } from "./utils";

function Home() {
  return <h1>HOME</h1>;
}

export default function App() {
  // const [showPage, setPage] = useState<number>(0);

  return (
    <>
      <Container>
        <Navbar>
          <Navbar.Brand href="/">
            <img
              src="https://global-uploads.webflow.com/5ee0d13e1d0466f2353dcb99/604b853988008d3835ce3dc5_Logo%20%E2%80%93%20Pipo%20Sau%CC%81de.svg"
              loading="lazy"
              alt=""
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Usuários" id="basic-nav-dropdown">
              <NavDropdown.Item href="/novo_usuario">
                Novo Usuário
              </NavDropdown.Item>
              <NavDropdown.Item href="/update_usuario">Update</NavDropdown.Item>
              <NavDropdown.Item href="/alterar_usuario">
                Alterar
              </NavDropdown.Item>
              <NavDropdown.Item href="/delete_usuario">Delete</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/add">Adicionar</Nav.Link>
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="form" element={<SearchPlanos />} />
          <Route
            path="novo_usuario"
            element={<SearchPlanos op={Operation.NOVO} />}
          />
          <Route
            path="update_usuario"
            element={<SearchPlanos op={Operation.UPDATE} />}
          />
          <Route path="delete_usuario" element={<AddPlano />} />
          <Route path="alterar_usuario" element={<AddPlano />} />
        </Routes>
      </Container>
    </>
  );
}
