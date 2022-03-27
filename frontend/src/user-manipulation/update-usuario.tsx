import { Operation } from "../utils";
import SearchPlanos from "./search-planos";

function UpdateUsuario() {
  return <SearchPlanos op={Operation.UPDATE} />;
}

export default UpdateUsuario;
