import { useState, useEffect, useRef } from "react";
import Select, { Options } from "react-select";
import { Card, Button, Form, Container } from "react-bootstrap";
import { getSessionEmpresa, getSessionToken, LooseObject } from "../utils";
import { getPlanos } from "./get-necessary-info/get-planos";
import { adicionarPlanos } from "./post-empresa-planos";

function AddPlanos() {
  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });
  const [planos, setPlanos] = useState<Options<string>>();

  const planosSearch = useRef<string[]>([]);

  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  async function handleAddPlano() {
    if (!planosSearch.current) {
      setShowMessage({
        show: true,
        success: false,
        message: "Preencha todos os campos",
      });
      return;
    }

    const response = await adicionarPlanos(
      empresa,
      planosSearch.current,
      token
    );

    if (response.status === 200) {
      setShowMessage({
        show: true,
        success: true,
        message: "Plano(s) adicionado(s) com sucesso",
      });
    } else if (response.status === 409) {
      setShowMessage({
        show: true,
        success: false,
        message: response.data.message,
      });
    } else {
      setShowMessage({
        show: true,
        success: false,
        message: "Problema ao adicionar plano(s)",
      });
    }
  }

  function handlePlanoSelect(e: Options<string>) {
    planosSearch.current = e.map((el: any) => el.value);
  }

  useEffect(() => {
    getPlanos()
      .then(setPlanos)
      .catch((err) => alert("Problemas com banco de dados"));
  }, []);

  return (
    <Container>
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" key="0" controlId="formPlanos">
              <Form.Label>Planos</Form.Label>
              <Select isMulti options={planos} onChange={handlePlanoSelect} />
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
              onClick={handleAddPlano}
            >
              Adicionar Plano
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddPlanos;
