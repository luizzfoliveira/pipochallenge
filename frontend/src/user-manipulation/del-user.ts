import axios, { AxiosResponse } from "axios";
import { BASEURL } from "../utils";

type UserDelete = {
  empresa: string;
  identificador: string;
};

export const deleteUser = async (
  empresa: string,
  ident: string,
  token: string
): Promise<AxiosResponse> => {
  const body: UserDelete = { empresa: empresa, identificador: ident };
  try {
    const response = await axios.delete(BASEURL + "/api/usuarios/deletar", {
      data: body,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    return err.response;
  }
};
