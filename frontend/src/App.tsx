import { Container } from "react-bootstrap";

export default function App() {
  function hyperlink(address: string, descricao: string) {
    return <a href={address}>{descricao}</a>;
  }

  return (
    <Container>
      <h1 data-testid="home-text">
        Bem vindo(a)!!
        <br />
        Aqui, você pode ver {hyperlink(
          "planos",
          "quais planos possuímos"
        )} e {hyperlink("login", "fazer login")} para gerenciar as informações
        dos funcionários de sua empresa.
      </h1>
    </Container>
  );
}
