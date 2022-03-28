import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { AxiosMethod, LooseObject, sortInfo } from "../utils";
import { Operation } from "../utils";
import { manipularUsuario } from "./manipular-usuario";

function InputForm(props: any) {
  console.log(props);
  async function handleSubmit() {
    if (Object.values(form.current).some((el) => !el)) {
      setShowMessage({
        show: true,
        success: false,
        message: "Preencha todos os campos",
      });
      return;
    }
    if (props.op === Operation.NOVO) {
      const response = await manipularUsuario(
        props.empresa,
        form.current,
        AxiosMethod.POST,
        "/api/usuarios/novo",
        props.token
      );
      if (response.status === 200) {
        setShowMessage({
          show: true,
          success: true,
          message: "Usuário adicionado com sucesso",
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
          message: "Problema ao adicionar usuário",
        });
      }
    } else if (props.op === Operation.UPDATE) {
      const response = await manipularUsuario(
        props.empresa,
        form.current,
        AxiosMethod.PATCH,
        "/api/usuarios/update",
        props.token
      );
      if (response.status === 200) {
        setShowMessage({
          show: true,
          success: true,
          message: "Informações acrescentadas com sucesso",
        });
      } else {
        setShowMessage({
          show: true,
          success: false,
          message: "Problema ao fazer update do usuário",
        });
      }
    } else if (props.op === Operation.ALTERAR) {
      const response = await manipularUsuario(
        props.empresa,
        form.current,
        AxiosMethod.PATCH,
        "/api/usuarios/alterar",
        props.token
      );
      if (response.status === 200) {
        setShowMessage({
          show: true,
          success: true,
          message: "Informações alteradas com sucesso",
        });
      } else {
        setShowMessage({
          show: true,
          success: false,
          message: "Problema ao fazer alterações no usuário",
        });
      }
    }
  }

  function handleFormChange(event: any) {
    const label = event.target.id.slice(4);
    const value = event.target.value;
    form.current[label] = value;
  }

  const form = useRef<LooseObject>({});

  const [showMessage, setShowMessage] = useState<LooseObject>({
    show: false,
    success: false,
    message: "",
  });
  const [cols, setCols] = useState<any>();

  let buttonName: string;
  if (props.op === Operation.NOVO) buttonName = "Adicionar Usuário";
  else if (props.op === Operation.UPDATE) buttonName = "Update Usuário";
  else if (props.op === Operation.ALTERAR) buttonName = "Alterar Usuário";
  else buttonName = "Modificar Usuário";

  useEffect(() => {
    form.current = { Planos: props.planos };
    sortInfo(props.info, props.userInfo);
    let colsHere: any = props.info.map((el: string, i: number) => {
      let placeholder = "";
      let disable = false;
      if (!(el in form.current)) form.current[el] = "";
      if (props.op === Operation.UPDATE && el in props.userInfo) {
        placeholder = props.userInfo[el];
        disable = true;
        form.current[el] = placeholder;
      } else if (props.op === Operation.ALTERAR && el in props.userInfo) {
        placeholder = props.userInfo[el];
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
    setCols(colsHere);
  }, [props]);

  console.log("cols");
  console.log(cols);

  return (
    <Form>
      {cols}
      {showMessage.show && (
        <>
          <small
            style={showMessage.success ? { color: "green" } : { color: "red" }}
          >
            *{showMessage.message}
          </small>
          <br />
        </>
      )}
      <Button
        style={{ backgroundColor: "#153db4", width: "100%" }}
        data-testid="upload"
        variant="primary"
        onClick={handleSubmit}
      >
        {buttonName}
      </Button>
    </Form>
  );
}

export default InputForm;
