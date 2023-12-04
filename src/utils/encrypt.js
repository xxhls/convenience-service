import { JSEncrypt } from "jsencrypt";
import { axiosIns } from "./request-ins";

let publicKey;

export const fetchPublickey = async () => {
  return axiosIns.request({
    url: "/loadPublicKey",
  });
};

export const encrypt = async (data) => {
  if (!publicKey) {
    const { code, data } = await fetchPublickey();
    if (code === 0) {
      publicKey = data;
    }
    // return Promise.resolve();
  }
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(publicKey);
  const encrypted = jsencrypt.encrypt(data);
  return Promise.resolve(encrypted);
};
