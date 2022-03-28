import axios from "axios";
import { BASEURL } from "../../utils";
import { Options } from "react-select";

export const getPlanosEmpresa = async (
  empresa: string,
  token: string
): Promise<Options<string>> => {
  const response = await axios.get(
    `${BASEURL}/api/empresa/planos?empresa=${empresa}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = response.data;
  const options: Options<string> = data.planos.map((el: string) => {
    return { label: el, value: el };
  });
  return options;
};
