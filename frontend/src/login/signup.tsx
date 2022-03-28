import { useState, useRef } from "react";
import { Card, Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { signupUser } from "./set-signup";
import { setSessionEmpresa, setSessionToken } from "../utils";

function SignUp(props: any) {
  const user = useRef<string>("");
  const senha = useRef<string>("");

  const [showError, setShowError] = useState<string>("");

  const navigate = useNavigate();

  async function handleSignup() {
    if (!user.current || !senha.current) {
      setShowError("Campos em branco");
      return;
    }

    const response = await signupUser(user.current, senha.current);
    if (response.status === 200) {
      setSessionToken(response.data.token);
      setSessionEmpresa(response.data.empresa);
      navigate("/area_empresa");
    } else if (response.status === 409) {
      setShowError("Usuário já existe");
    } else {
      setShowError("Problema criando login");
    }
  }

  function handleUserChange(event: any) {
    const value = event.target.value;
    user.current = value;
  }

  function handlePassChange(event: any) {
    const value = event.target.value;
    senha.current = value;
  }

  return (
    <Container>
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" key="1" controlId="formIdentificador">
              <Form.Label>Nome de Usuário</Form.Label>
              <Form.Control
                placeholder="Nome da Empresa"
                type="text"
                onChange={handleUserChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" key="2" controlId="formIdentificador">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" onChange={handlePassChange} />
            </Form.Group>
            {showError && (
              <>
                <small style={{ color: "red" }}>*{showError}</small>
                <br />
              </>
            )}
            <Button
              style={{ backgroundColor: "#153db4" }}
              onClick={handleSignup}
            >
              SignUp
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignUp;
