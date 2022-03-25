import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { LooseObject, sortInfo } from "../utils";
import axios from "axios";
import { BASEURL } from "../utils";
import { Operation } from "../utils";
import { getPreenchidos } from "./get-preenchidos";

/* Alternativa para fazer a verificação em tempo real:
 * Pedir o identificador (Nome ou CPF) na hora de gerar o formulário
 *  */

const identificadores = ["Nome", "CPF"];

function InputForm(props: any) {
  async function handleSubmit() {}

  function handleFormChange(event: any) {
    const label = event.target.id.slice(4);
    const value = event.target.value;
    form.current[label] = value;
    if (identificadores.includes(label) && props.op === Operation.UPDATE) {
      getPreenchidos("Felipe", value)
        .then((val) => {
          let newDisable = [...disable];
          let newValue = [...pHolder];
          console.log(newValue);
          cols.forEach((el: any, i: number) => {
            // console.log(el.props.children[0].props.children);
            if (
              el.props.children[0].props.children in val &&
              el.props.children[0].props.children !== label
            ) {
              newDisable[i] = true;
              newValue[i] = val[el.props.children[0].props.children];
              form.current[el.props.children[0].props.children] =
                val[el.props.children[0].props.children];
            }
          });
          setDisable(newDisable);
          setPlaceholder(newValue);
        })
        .catch((err) => {
          if (err.request.status === 404) {
            let newDisable = new Array(disable.length).fill(false);
            let newValue = new Array(value.length).fill("");
            setDisable(newDisable);
            setPlaceholder(newValue);
          }
        });
    } else if (identificadores.includes(label) && props.op === Operation.NOVO) {
      getPreenchidos("Felipe", value)
        .then((val) => {
          setShowError("Usuário já existe");
          setDisableButton(true);
        })
        .catch((err) => {
          setShowError("");
          setDisableButton(false);
        });
    }
  }

  const form = useRef<LooseObject>({});

  const [disable, setDisable] = useState<boolean[]>(
    new Array(props.info.length).fill(false)
  );
  const [pHolder, setPlaceholder] = useState<string[]>(
    new Array(props.info.length).fill("")
  );
  const [showError, setShowError] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);

  console.log(pHolder);
  sortInfo(props.info);
  let cols: any[] = props.info.map((el: string, i: number) => {
    form.current[el] = "";
    return (
      <Form.Group className="mb-3" key={el} controlId={`form${el}`}>
        <Form.Label>{el}</Form.Label>
        <Form.Control
          placeholder={pHolder[i]}
          type="text"
          onChange={handleFormChange}
          disabled={disable[i]}
        />
      </Form.Group>
    );
  });

  return (
    <Form>
      {cols}
      {showError && (
        <>
          <small style={{ color: "red" }}>*{showError}</small>
          <br />
        </>
      )}
      <Button
        style={{ width: "100%" }}
        data-testid="upload"
        variant="primary"
        onClick={handleSubmit}
        disabled={disableButton}
      >
        Download!
      </Button>
    </Form>
  );
}

export default InputForm;
