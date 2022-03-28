export enum Operation {
  NOVO,
  UPDATE,
  ALTERAR,
  DEL_PLANO,
}

export enum AxiosMethod {
  GET,
  POST,
  PATCH,
  DELETE,
}

export interface LooseObject {
  [key: string]: any;
}

export const BASEURL = "http://localhost:8000";

export const sortInfo = (info: string[], userInfo: string[]) => {
  const order = ["Nome", "CPF"];
  let i = 0;
  for (const o of order) {
    const j = info.indexOf(o);
    if (j > -1) {
      const temp = info[j];
      info[j] = info[i];
      info[i] = temp;
      i++;
    }
  }
  for (const ui in userInfo) {
    const j = info.indexOf(ui);
    if (j > -1 && !order.includes(ui)) {
      const temp = info[j];
      info[j] = info[i];
      info[i] = temp;
      i++;
    }
  }
};

export function setSessionToken(userToken: string) {
  localStorage.setItem("token", JSON.stringify(userToken));
}

export function getSessionToken() {
  const tokenString: any = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

export function delSessionToken() {
  localStorage.removeItem("token");
}

export function setSessionEmpresa(empresa: string) {
  localStorage.setItem("empresa", JSON.stringify(empresa));
}

export function getSessionEmpresa() {
  const empresaString: any = localStorage.getItem("empresa");
  const empresa = JSON.parse(empresaString);
  return empresa;
}

export function delSessionEmpresa() {
  localStorage.removeItem("empresa");
}
