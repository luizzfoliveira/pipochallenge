import axios from "axios";
import { BASEURL } from "./utils";

export const getNecessaryInfo = async (planos: string): Promise<string[]> => {
  const response = await axios.get(`${BASEURL}/api/info?planos=${planos}`);
  return response.data.info;
};
