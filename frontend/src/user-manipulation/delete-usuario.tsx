import { useState, useRef } from "react";
import { Card, Button, Form, Modal, Container } from "react-bootstrap";
import { LooseObject, getSessionEmpresa, getSessionToken } from "../utils";
import { deleteUser } from "./del";
import { getPreenchidos } from "./get-preenchidos";

function DeleteUsuario() {
  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  const user = useRef<string>("");

  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<LooseObject>({});

  async function handleDelete() {
    try {
      const userInf = await getPreenchidos(empresa, user.current, token);
      setShowAlert(true);
      setUserInfo(userInf);
    } catch (err: any) {
      if (err.request.status === 404) {
        setShowMessage({
          show: true,
          success: false,
          message: "Usuário não encontrado",
        });
      } else {
        setShowMessage({
          show: true,
          success: false,
          message: "Problemas internos",
        });
      }
    }
    // Pesquisar usuário e show error
    // se nao tiver erro mostrar as info do usuario no popup
  }

  function handleClose() {
    setShowAlert(false);
  }

  async function handleConfirm() {
    const response = await deleteUser(empresa, user.current, token);
    setShowAlert(false);
    if (response.status === 200) {
      setShowMessage({
        show: true,
        success: true,
        message: "Usuário deletado com sucesso",
      });
    } else if (response.status === 404) {
      setShowMessage({
        show: true,
        success: false,
        message: "Usuário não encontrado",
      });
    } else {
      setShowMessage({
        show: true,
        success: false,
        message: "Problema ao deletar o usuário",
      });
    }
  }

  function handleFormChange(event: any) {
    const value = event.target.value;
    user.current = value;
  }

  return (
    <>
      <Container>
        <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <Card.Body>
            <Form>
              <Form.Group
                className="mb-3"
                key="1"
                controlId="formIdentificador"
              >
                <Form.Label>Identificador</Form.Label>
                <Form.Control
                  placeholder="Nome ou CPF"
                  type="text"
                  onChange={handleFormChange}
                />
              </Form.Group>
              {showMessage.show && (
                <>
                  <small
                    style={
                      showMessage.success
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    *{showMessage.message}
                  </small>
                  <br />
                </>
              )}
              <Button className="generate-info" onClick={handleDelete}>
                Deletar Usuário
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Modal show={showAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão do Usuário?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteUsuario;
