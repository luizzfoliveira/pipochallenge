import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { getNecessaryInfo } from "./get-necessary-info";
import { getPlanos } from "./get-planos";
import { Options } from "react-select";
import { Card, Form, Button } from "react-bootstrap";
import { sortInfo } from "./utils";

function InputInfo(props: any) {
  sortInfo(props.info);
  const cols = props.info.map((el: string) => (
    <Form.Group className="mb-3" controlId={`form${el}`}>
      <Form.Label>{el}</Form.Label>
      <Form.Control type="text" />
    </Form.Group>
  ));
  return (
    <Form>
      {cols}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function SearchPlanos() {
  const planosSearch = useRef<string>("");
  // const info = useRef<string[]>([]);
  async function generateInfo() {
    console.log();
    const inf = await getNecessaryInfo(planosSearch.current);
    setInfo(inf);
    setShowInfo(true);
  }

  function handlePlanoSelect(e: Options<string>) {
    planosSearch.current = e.map((el: any) => el.value).join("/");
  }

  const [showInfo, setShowInfo] = useState(false);

  const [info, setInfo] = useState<string[]>();

  const [planos, setPlanos] = useState<Options<string>>();
  useEffect(() => {
    getPlanos().then(setPlanos);
  }, []);

  return (
    <div className="App">
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <Select isMulti options={planos} onChange={handlePlanoSelect} />
          <Button className="generate-info" onClick={generateInfo}>
            Gerar Formulário
          </Button>
          {showInfo && <InputInfo info={info} />}
        </Card.Body>
      </Card>
    </div>
  );
}

export default SearchPlanos;
