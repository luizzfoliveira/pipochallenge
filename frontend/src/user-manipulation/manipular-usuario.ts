import axios, { AxiosResponse } from "axios";
import { AxiosMethod, BASEURL } from "../utils";

type UserManipulation = {
  empresa: string;
  info: object;
};

export const manipularUsuario = async (
  empresa: string,
  info: object,
  method: AxiosMethod,
  endpoint: string,
  token: string
): Promise<AxiosResponse> => {
  const body: UserManipulation = { empresa: empresa, info: info };
  try {
    let response: any;
    if (method === AxiosMethod.POST)
      response = await axios.post(BASEURL + endpoint, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    else if (method === AxiosMethod.PATCH)
      response = await axios.patch(BASEURL + endpoint, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    return response;
  } catch (err: any) {
    return err.response;
  }
};
