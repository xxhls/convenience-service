import { axiosIns, encrypt } from "@/utils";

export const sendCode = async (phone) => {
  const encryptPhone = await encrypt(phone);
  return axiosIns.request({
    url: "/getCloudSmsCode",
    method: "POST",
    data: {
      phoneNumber: encryptPhone,
    },
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
