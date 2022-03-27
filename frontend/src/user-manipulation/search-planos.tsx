import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { getNecessaryInfo } from "./get-necessary-info/get-necessary-info";
import { getPlanos } from "./get-necessary-info/get-planos";
import { Options } from "react-select";
import { Card, Button, Form, Container } from "react-bootstrap";
import InputForm from "./input-form";
import { getPreenchidos } from "./get-preenchidos";
import {
  getSessionEmpresa,
  getSessionToken,
  LooseObject,
  Operation,
} from "../utils";

function SearchPlanos(props: any) {
  const [showError, setShowError] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const [planos, setPlanos] = useState<Options<string>>();
  const [info, setInfo] = useState<string[]>();

  const user = useRef<string>("");
  const userInfo = useRef<void | LooseObject>({});
  const planosSearch = useRef<string>("");

  const token = getSessionToken();
  const empresa = getSessionEmpresa();

  // const info = useRef<string[]>([]);
  async function generateInfo() {
    if (props.op === Operation.ALTERAR) {
      try {
        userInfo.current = await getPreenchidos(empresa, user.current, token);
        setInfo(Object.keys(userInfo.current));
        setShowError("");
        setShowInfo(true);
      } catch (err: any) {
        setShowError("Usuário não encontrado");
        setShowInfo(false);
      }
      return;
    }
    if (!planosSearch.current) {
      setShowError("Planos em branco");
      setShowInfo(false);
      return;
    }
    setShowError("");
    try {
      const inf = await getNecessaryInfo(planosSearch.current);

      setInfo(inf);
    } catch (e: any) {
      if (e.response.status === 404) {
        setShowError("Plano não encontrado");
        setShowInfo(false);
      } else {
        setShowError("Problemas com o banco de dados");
        setShowInfo(false);
      }
      return;
    }

    if (props.op === Operation.UPDATE) {
      try {
        userInfo.current = await getPreenchidos(empresa, user.current, token);
        setShowInfo(true);
      } catch (err: any) {
        if (err.request.status === 404) {
          setShowError("Usuário não encontrado");
          setShowInfo(false);
        }
      }
    } else if (props.op === Operation.NOVO) {
      try {
        await getPreenchidos(empresa, user.current, token);
        setShowError("Usuário já existente");
        setShowInfo(false);
      } catch (err: any) {
        if (err.request.status === 404) {
          setShowError("");
          setShowInfo(true);
        } else {
          setShowError("Problema interno");
          setShowInfo(false);
        }
      }
    }
  }

  function handleFormChange(event: any) {
    const value = event.target.value;
    user.current = value;
  }

  function handlePlanoSelect(e: Options<string>) {
    planosSearch.current = e.map((el: any) => el.value).join("/");
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
            {props.op === Operation.ALTERAR ? (
              <></>
            ) : (
              <Form.Group className="mb-3" key="0" controlId="formPlanos">
                <Form.Label>Planos</Form.Label>
                <Select isMulti options={planos} onChange={handlePlanoSelect} />
              </Form.Group>
            )}
            <Form.Group className="mb-3" key="1" controlId="formIdentificador">
              <Form.Label>Identificador</Form.Label>
              <Form.Control
                placeholder="Nome ou CPF"
                type="text"
                onChange={handleFormChange}
              />
            </Form.Group>
            {showError && (
              <>
                <small style={{ color: "red" }}>*{showError}</small>
                <br />
              </>
            )}
            <Button className="generate-info" onClick={generateInfo}>
              Gerar Formulário
            </Button>
          </Form>
          {showInfo && (
            <InputForm
              info={info}
              op={props.op}
              userInfo={userInfo.current}
              empresa={empresa}
              token={token}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SearchPlanos;
