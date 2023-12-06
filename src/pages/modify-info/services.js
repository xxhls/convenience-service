import { axiosIns, encrypt } from "@/utils";

/**
 * 更新姓名
 * @param {*} param0
 * @returns
 */
export const updateUserName = ({ id, userName }) => {
  return axiosIns.request({
    url: "/updateUserName",
    data: {
      id,
      userName,
    },
    method: "POST",
  });
};

/**
 * 更新手机号
 * @param {*} param0
 * @returns
 */
export const updatePhone = async ({ id, userPhone }) => {
  const encryptPhone = await encrypt(userPhone);
  return axiosIns.request({
    url: "/updateUserPhone",
    data: {
      id,
      userPhone: encryptPhone,
    },
    method: "POST",
  });
};

export const updateIdentityCard = async ({ id, identityCard }) => {
  const encryptIdentity = await encrypt(identityCard);
  return axiosIns.request({
    url: "/updateIdentityCard",
    data: {
      id,
      identityCard: encryptIdentity,
    },
    method: "POST",
  });
};

export const updateRegion = ({ id, regionId }) => {
  return axiosIns.request({
    url: "/updateUserRegion",
    data: {
      id,
      regionId,
    },
    method: "POST",
  });
};
