import axios, { AxiosResponse } from "axios";
import { BASEURL } from "../utils";

type AddPlano = {
  empresa: string;
  planos: string[];
};

export const adicionarPlanos = async (
  empresa: string,
  planos: string[],
  token: string
): Promise<AxiosResponse> => {
  const body: AddPlano = { empresa: empresa, planos: planos };
  try {
    const response = await axios.post(`${BASEURL}/api/empresa/planos`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    return err.response;
  }
};
