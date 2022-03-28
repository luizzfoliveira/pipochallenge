import { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { getSessionToken } from "./utils";

export default function Layout({ children }: any) {
  const token = getSessionToken();
  const [showLogin, setShowLogin] = useState<boolean>(true);
  useEffect(() => {
    if (!token) setShowLogin(true);
    else setShowLogin(false);
  }, [token]);

  return (
    <>
      <Container>
        <Navbar bg="white">
          <Navbar.Brand href="/">
            <img
              src="https://global-uploads.webflow.com/5ee0d13e1d0466f2353dcb99/604b853988008d3835ce3dc5_Logo%20%E2%80%93%20Pipo%20Sau%CC%81de.svg"
              loading="lazy"
              alt=""
            />
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/planos">Planos</Nav.Link>
            {!showLogin ? (
              <Nav.Link href="/area_empresa">Área da Empresa</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/signup">SignUp</Nav.Link>
                <Nav.Link href="/login">LogIn</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar>
      </Container>
      {children}
    </>
  );
}
