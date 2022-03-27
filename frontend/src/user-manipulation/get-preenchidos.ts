import axios from "axios";
import { BASEURL, LooseObject } from "../utils";

export const getPreenchidos = async (
  empresa: string,
  user: string,
  token: string
): Promise<LooseObject> => {
  const response = await axios.get(
    `${BASEURL}/api/user?empresa=${empresa}&ident=${user}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
  // return response.data.info;
};
