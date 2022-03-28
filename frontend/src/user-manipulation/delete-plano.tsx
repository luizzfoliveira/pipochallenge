import { useEffect, useRef, useState } from "react";
import { Card, Button, Form, Modal, Container } from "react-bootstrap";
import { LooseObject, getSessionEmpresa, getSessionToken } from "../utils";
import Select, { Options } from "react-select";
import { getPlanos } from "./get-necessary-info/get-planos";
import { getPreenchidos } from "./get-preenchidos";
import { deletePlano } from "./del-plano";
import { getPlanosEmpresa } from "./get-necessary-info/get-empresa-planos";

function DeletePlano() {
  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  const user = useRef<string>("");
  const planosSearch = useRef<string[]>([]);

  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [planos, setPlanos] = useState<Options<string>>();
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
    const response = await deletePlano(
      empresa,
      user.current,
      planosSearch.current,
      token
    );
    setShowAlert(false);
    if (response.status === 200) {
      setShowMessage({
        show: true,
        success: true,
        message: "Plano(s) deletado(s) com sucesso",
      });
    } else if (response.status === 404) {
      setShowMessage({
        show: true,
        success: false,
        message: "Usuário não encontrado",
      });
    } else if (response.status === 422) {
      setShowMessage({
        show: true,
        success: false,
        message: "Usuário não possui nenhum plano",
      });
    } else {
      setShowMessage({
        show: true,
        success: false,
        message: "Problema ao deletar o plano(s)",
      });
    }
  }

  function handleFormChange(event: any) {
    const value = event.target.value;
    user.current = value;
  }

  function handlePlanoSelect(e: Options<string>) {
    planosSearch.current = e.map((el: any) => el.value);
  }

  useEffect(() => {
    getPlanosEmpresa(empresa, token)
      .then(setPlanos)
      .catch((err) => alert("Problemas com banco de dados"));
  }, []);

  return (
    <>
      <Container>
        <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" key="0" controlId="formPlanos">
                <Form.Label>Planos</Form.Label>
                <Select isMulti options={planos} onChange={handlePlanoSelect} />
              </Form.Group>
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
              <Button
                style={{ backgroundColor: "#153db4" }}
                onClick={handleDelete}
              >
                Deletar Plano(s)
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Modal show={showAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão do Plano?</Modal.Title>
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

export default DeletePlano;
