import { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { LooseObject, sortInfo } from "../utils";
import { Operation } from "../utils";

function InputForm(props: any) {
  async function handleSubmit() {}

  function handleFormChange(event: any) {
    const label = event.target.id.slice(4);
    const value = event.target.value;
    form.current[label] = value;
  }

  const form = useRef<LooseObject>({});

  const [showError, setShowError] = useState<string>("");

  sortInfo(props.info, props.userInfo);
  let cols: any[] = props.info.map((el: string, i: number) => {
    let placeholder = "";
    let disable = false;
    form.current[el] = "";
    if (props.op === Operation.UPDATE && el in props.userInfo) {
      placeholder = props.userInfo[el];
      disable = true;
      form.current[el] = placeholder;
    }

    return (
      <Form.Group className="mb-3" key={el} controlId={`form${el}`}>
        <Form.Label>{el}</Form.Label>
        <Form.Control
          placeholder={placeholder}
          type="text"
          onChange={handleFormChange}
          disabled={disable}
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
      >
        Download!
      </Button>
    </Form>
  );
}

export default InputForm;
