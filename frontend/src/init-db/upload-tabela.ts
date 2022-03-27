import axios, { AxiosResponse } from "axios";
import { BASEURL } from "../utils";

export const uploadTabela = async (
  empresa: string,
  file: any,
  token: string
): Promise<AxiosResponse> => {
  try {
    let formData = new FormData();
    formData.append("base", file);
    formData.append("empresa", empresa);

    let response = await axios.post(BASEURL + "/api/tabela", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err: any) {
    return err.response;
  }
};
