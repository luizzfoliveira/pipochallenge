export enum Operation {
  NOVO,
  UPDATE,
}

export interface LooseObject {
  [key: string]: any;
}

export const BASEURL = "http://localhost:8000";

export const sortInfo = (info: string[], userInfo: string[]) => {
  console.log(userInfo);
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
