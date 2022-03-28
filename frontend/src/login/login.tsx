import { useRef, useState } from "react";
import { Card, Button, Form, Container } from "react-bootstrap";
import { LooseObject, setSessionEmpresa, setSessionToken } from "../utils";
import { loginUser } from "./set-login";
import { useNavigate } from "react-router-dom";

function Login(props: any) {
  const user = useRef<string>("");
  const senha = useRef<string>("");

  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });

  const navigate = useNavigate();

  async function handleLogin() {
    if (!user.current || !senha.current) {
      setShowMessage({
        show: true,
        success: false,
        message: "Campos em branco",
      });
      return;
    }

    const response = await loginUser(user.current, senha.current);
    if (response.status === 200) {
      setSessionToken(response.data.token);
      setSessionEmpresa(response.data.empresa);
      navigate("/area_empresa");
    } else if (response.status === 401) {
      setShowMessage({
        show: true,
        success: false,
        message: "Usuário ou senha inválidos",
      });
    } else {
      setShowMessage({
        show: true,
        success: false,
        message: "Problema criando login",
      });
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
            {showMessage.show && (
              <>
                <small
                  style={
                    showMessage.success ? { color: "green" } : { color: "red" }
                  }
                >
                  *{showMessage.message}
                </small>
                <br />
              </>
            )}
            <Button
              style={{ backgroundColor: "#153db4" }}
              className="generate-info"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
