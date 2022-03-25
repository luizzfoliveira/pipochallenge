import { useRef, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { setPlano } from "./set-plano";

function AddPlano() {
  const plano = useRef<string>("");
  const info = useRef<string[]>([]);
  // const resp = useRef<number>(200);

  function handleName(e: any) {
    plano.current = e.target.value;
  }

  function handleInfo(e: any) {
    info.current = e.target.value.split(",").map((el: string) => el.trim());
  }

  async function handleAdicionar() {
    if (!plano.current) {
      setShowError("Plano em branco");
      return;
    } else if (info.current.length === 0) {
      setShowError("Informações em branco");
      return;
    }

    const status = await setPlano(plano.current, info.current);
    if (status === 200) setShowError("");
    else if (status === 409) setShowError("Plano já existente");
    else setShowError("Erro ao adicionar o plano");
  }

  const [showError, setShowError] = useState<string>("");

  return (
    <div className="App">
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nome-plano">
              <Form.Label>Nome do Plano</Form.Label>
              <Form.Control type="text" onChange={handleName} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="info">
              <Form.Label>Informações Necessárias</Form.Label>
              <Form.Control type="text" onChange={handleInfo} />
            </Form.Group>
            {showError && (
              <>
                <small style={{ color: "red" }}>*{showError}</small>
                <br />
              </>
            )}
            <Button className="generate-info" onClick={handleAdicionar}>
              Adicionar Plano
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddPlano;
