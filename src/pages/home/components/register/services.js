import { axiosIns, encrypt } from "@/utils";

export const register = async ({
  userName,
  userPhone,
  identityCard,
  regionId,
}) => {
  const encryptPhone = await encrypt(userPhone);
  const encryprIdCard = await encrypt(identityCard);
  return axiosIns.request({
    url: "/addUser",
    method: "POST",
    data: {
      userPhone: encryptPhone,
      userName,
      identityCard: encryprIdCard,
      regionId,
    },
  });
};
