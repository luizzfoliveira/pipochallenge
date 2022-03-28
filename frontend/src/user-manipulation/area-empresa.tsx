import { Container } from "react-bootstrap";

export default function AreaUsuario(props: any) {
  function hyperlink(address: string, descricao: string) {
    return <a href={address}>{descricao}</a>;
  }

  return (
    <Container
      style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
    >
      <h2>
        Bem vindo(a) à área da sua empresa!!
        <br />
        Aqui, é possível gerenciar as informações dos beneficiários dos planos
        de saúde contratados por sua emrpesa.
        <br />
        Para isso, {hyperlink("add_plano", "adicione planos")} à sua empresa,
        para, então, gerir as informações de seus usuários:
        <ul>
          <li>
            {hyperlink("/novo_usuario", "adicionando um novo beneficiário")};
          </li>
          <li>
            {hyperlink(
              "/update_usuario",
              "adicionando informações para um novo plano de um beneficiário"
            )}
            ;
          </li>
          <li>
            {hyperlink(
              "/alterar_usuario",
              "alterando informações de um beneficiário"
            )}
            ;
          </li>
          <li>
            {hyperlink(
              "/delete_planos",
              "removendo um funcionário de um plano"
            )}
            ; e
          </li>
          <li>{hyperlink("/delete_usuario", "deletando um beneficiário")}.</li>
        </ul>
        Além disso, é possível{" "}
        {hyperlink(
          "/init_db",
          "inicializar o banco de dados a partir de uma tabela CSV"
        )}{" "}
        e, também, baixar todo o banco de dados pelo botão de download.
      </h2>
    </Container>
  );
}
