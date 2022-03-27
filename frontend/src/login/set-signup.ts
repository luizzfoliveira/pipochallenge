import axios, { AxiosResponse } from "axios";
import { BASEURL } from "../utils";

type UserLogin = {
  empresa: string;
  senha: string;
};

export const signupUser = async (
  empresa: string,
  senha: string
): Promise<AxiosResponse> => {
  const body: UserLogin = { empresa: empresa, senha: senha };
  try {
    let response = await axios.post(BASEURL + "/api/signup", body);
    return response;
  } catch (err: any) {
    return err.response;
  }
};
