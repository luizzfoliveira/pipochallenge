import { useState, useRef } from "react";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import { getSessionToken, getSessionEmpresa, LooseObject } from "../utils";
import { uploadTabela } from "./upload-tabela";

function InitTabela(props: any) {
  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  const selectedFile = useRef<any>(undefined);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });

  async function handleUpload() {
    if (selectedFile.current === undefined) {
      setShowMessage({
        show: true,
        success: false,
        message: "Escolha um arquivo",
      });
      return;
    }

    const extension = selectedFile.current.name.slice(-4);
    if (extension !== ".csv") {
      setShowMessage({
        show: true,
        success: false,
        message: "Por favor, selecione um arquivo CSV",
      });
      return;
    }
    setShowAlert(true);
  }

  function handleClose() {
    setShowAlert(false);
  }

  function handleFileChange(e: any) {
    selectedFile.current = e.target.files[0];
  }

  async function handleConfirm() {
    const response = await uploadTabela(empresa, selectedFile.current, token);
    if (response.status === 200) {
      setShowMessage({
        show: true,
        success: true,
        message: "Banco de dados criado com sucesso",
      });
    } else if (response.status === 409) {
      setShowMessage({
        show: true,
        success: false,
        message: `${response.data.message}\n${JSON.stringify(
          response.data.usuarios,
          null,
          2
        )}`,
      });
    } else {
      setShowMessage({
        show: true,
        success: false,
        message: "Problema inicializando o banco de dados",
      });
    }
    setShowAlert(false);
  }

  return (
    <>
      <Container>
        <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" key="0" controlId="formTabela">
                <Form.Label>Tabela</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
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
                    <pre>*{showMessage.message}</pre>
                  </small>
                  <br />
                </>
              )}
              <Button className="init-db" onClick={handleUpload}>
                Fazer Upload
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Modal show={showAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Upload da Tabela?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja continuar com o upload da tabela?
          <br />
          Caso haja dados no banco de dados, eles serão sobrescrevidos.
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

export default InitTabela;
