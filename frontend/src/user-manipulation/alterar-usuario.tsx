import { Operation } from "../utils";
import SearchPlanos from "./search-planos";

function AlterarUsuario() {
  return <SearchPlanos op={Operation.ALTERAR} />;
}

export default AlterarUsuario;
