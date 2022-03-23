export const sortInfo = (info: string[]) => {
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
};

export const BASEURL = "http://localhost:8000";
