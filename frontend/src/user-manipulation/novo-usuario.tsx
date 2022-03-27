import { Operation } from "../utils";
import SearchPlanos from "./search-planos";

function NovoUsuario() {
  return <SearchPlanos op={Operation.NOVO} />;
}

export default NovoUsuario;
