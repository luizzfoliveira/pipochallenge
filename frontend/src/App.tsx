import { Navbar, Container, Nav } from "react-bootstrap";
// import { useState } from "react";
import SearchPlanos from "./get-necessary-info/search-planos";
import AddPlano from "./plano-manipulation/add-plano";
import { Routes, Route } from "react-router-dom";

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
            <Nav.Link href="/form">Form</Nav.Link>
            <Nav.Link href="/add">Adicionar</Nav.Link>
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="form" element={<SearchPlanos />} />
          <Route path="add" element={<AddPlano />} />
        </Routes>
      </Container>
    </>
  );
}
