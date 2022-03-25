import axios, { AxiosError } from "axios";
import { BASEURL } from "../utils";

type PlanosInfo = {
  plano: string;
  info: string[];
};

export const setPlano = async (
  plano: string,
  info: string[]
): Promise<number> => {
  const body: PlanosInfo = { plano: plano, info: info };
  try {
    const response = await axios.post(BASEURL + "/api/info", body);
    console.log(response);
    return response.status;
  } catch (err: any) {
    return err.response.status;
  }
};
