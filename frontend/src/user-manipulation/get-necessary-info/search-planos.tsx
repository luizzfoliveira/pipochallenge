import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { getNecessaryInfo } from "./get-necessary-info";
import { getPlanos } from "./get-planos";
import { Options } from "react-select";
import { Card, Button } from "react-bootstrap";
import InputForm from "../add-user";

function SearchPlanos(props: any) {
  const planosSearch = useRef<string>("");

  // const info = useRef<string[]>([]);
  async function generateInfo() {
    if (!planosSearch.current) {
      setShowError("Planos em branco");
      setShowInfo(false);
      return;
    }
    setShowError("");
    try {
      const inf = await getNecessaryInfo(planosSearch.current);
      setInfo(inf);
      setShowInfo(true);
    } catch (e: any) {
      if (e.response.status === 404) alert("Plano não encontrado");
      else alert("Problemas com o banco de dados");
    }
  }

  function handlePlanoSelect(e: Options<string>) {
    planosSearch.current = e.map((el: any) => el.value).join("/");
  }

  const [showError, setShowError] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState<string[]>();

  const [planos, setPlanos] = useState<Options<string>>();
  useEffect(() => {
    getPlanos()
      .then(setPlanos)
      .catch((err) => alert("Problemas com banco de dados"));
  }, []);

  return (
    <div className="App">
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <Select isMulti options={planos} onChange={handlePlanoSelect} />
          {showError && (
            <>
              <small style={{ color: "red" }}>*{showError}</small>
              <br />
            </>
          )}
          <Button className="generate-info" onClick={generateInfo}>
            Gerar Formulário
          </Button>
          {showInfo && <InputForm info={info} op={props.op} />}
        </Card.Body>
      </Card>
    </div>
  );
}

export default SearchPlanos;
