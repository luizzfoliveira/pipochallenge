import axios from "axios";
import { BASEURL } from "../../utils";
import { Options } from "react-select";

export const getPlanos = async (): Promise<Options<string>> => {
  const response = await axios.get(BASEURL + "/api/planos");
  const data = response.data;
  const options: Options<string> = data.planos.map((el: string) => {
    return { label: el, value: el };
  });
  return options;
};
