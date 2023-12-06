import { axiosIns, encrypt } from "@/utils";

export const sendCode = async (phone) => {
  const encryptPhone = await encrypt(phone);
  return axiosIns.request({
    url: "/getCloudSmsCode",
    method: "POST",
    data: {
      phoneNumber: encryptPhone,
    },
    timeout: 0
  });
};

export const login = async (phone, code) => {
  const encryptPhone = await encrypt(phone);
  return axiosIns.request({
    url: "/loginSystemForSmsCode",
    method: "POST",
    data: {
      phoneNumber: encryptPhone,
      code,
    },
  });
};
