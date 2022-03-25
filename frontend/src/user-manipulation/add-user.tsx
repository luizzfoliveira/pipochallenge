import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { LooseObject, sortInfo } from "../utils";
import axios from "axios";
import { BASEURL } from "../utils";

function InputInfo(props: any) {
  async function handleSubmit() {
    if (selectedFile === undefined) {
      alert("Por favor, selecione algum arquivo");
      return;
    }
    const extension = selectedFile.name.slice(-4);

    setLoading(true);
    let currentFile = selectedFile;

    let formData = new FormData();

    formData.append("file", currentFile);
    for (const [key, value] of Object.entries(form.current)) {
      formData.append(key, value);
    }

    try {
      const response = await axios.post(
        BASEURL + "/api/novo_beneficiario",
        formData,
        { headers: { responseType: "blob" } }
      );

      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Untitled.csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (e: any) {
      if (e.response.status === 422) alert("Dados conflitantes");
      else alert("Problemas com o banco de dados");
    }
  }

  function handleFormChange(event: any) {
    const label = event.target.id.slice(4);
    const value = event.target.value;
    form.current[label] = value;
  }

  function onFileChange(event: any) {
    setSelectedFile(event.target.files[0]);
  }

  function handleNewUser(event: any) {
    const label = "new_user";
    const value = event.target.checked;
    form.current[label] = value;
    console.log(form.current);
  }

  const [selectedFile, setSelectedFile] = useState<any>();
  const form = useRef<LooseObject>({ new_user: false });
  const [loading, setLoading] = useState<boolean>(false);

  sortInfo(props.info);
  const cols = props.info.map((el: string) => {
    form.current[el] = "";
    return (
      <Form.Group className="mb-3" key={el} controlId={`form${el}`}>
        <Form.Label>{el}</Form.Label>
        <Form.Control type="text" onChange={handleFormChange} />
      </Form.Group>
    );
  });
  console.log(form);
  return (
    <Form>
      {cols}
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="New user" onChange={handleNewUser} />
      </Form.Group>
      <Form.Control type="file" onChange={onFileChange} />
      <Button
        style={{ width: "100%" }}
        data-testid="upload"
        variant="primary"
        onClick={handleSubmit}
      >
        {loading && (
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        Download!
      </Button>
    </Form>
  );
}

export default InputInfo;
