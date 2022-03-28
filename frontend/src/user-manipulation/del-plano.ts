import axios, { AxiosResponse } from "axios";
import { BASEURL } from "../utils";

type PlanoDelete = {
  empresa: string;
  identificador: string;
  planos: string[];
};

export const deletePlano = async (
  empresa: string,
  ident: string,
  planos: string[],
  token: string
): Promise<AxiosResponse> => {
  const body: PlanoDelete = {
    empresa: empresa,
    identificador: ident,
    planos: planos,
  };
  try {
    const response = await axios.delete(
      BASEURL + "/api/usuarios/delete_plano",
      {
        data: body,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (err: any) {
    return err.response;
  }
};
