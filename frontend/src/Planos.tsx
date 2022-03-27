import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getPlanos } from "./user-manipulation/get-necessary-info/get-planos";

export default function Planos() {
  const [planos, setPlanos] = useState<any>();

  useEffect(() => {
    getPlanos()
      .then((plan) => {
        const toSet = plan.map((el: any) => <li>{el.value}</li>);
        setPlanos(toSet);
      })
      .catch((err) => alert("Problemas com banco de dados"));
  }, []);

  return (
    <Container>
      <h2>Hoje, atendemos aos planos:</h2>
      <ul>{planos}</ul>
    </Container>
  );
}
