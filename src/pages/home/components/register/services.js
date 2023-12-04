import { axiosIns, encrypt } from "@/utils";

export const register = async ({
  userName,
  userPhone,
  identityCard,
  regionId,
}) => {
  const encryptPhone = await encrypt(userPhone);
  return axiosIns.request({
    url: "/addUser",
    method: "POST",
    data: {
      userPhone: encryptPhone,
      userName,
      identityCard,
      regionId,
    },
  });
};
