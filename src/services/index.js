import { axiosIns } from "@/utils";

/**
 * 根据区域Id查询区域全面
 * @param {string} regionId 区域Id
 * @returns any
 */
export const queryRegionNameById = (regionId) => {
  return axiosIns.request({
    url: "/getRegionFullName",
    params: { regionId },
    method: "GET",
  });
};

export const loadImage = (imageId, type = "S") => {
  return axiosIns.request({
    url: "/showImage",
    params: {
      id: imageId,
      type,
    },
    responseType: "blob",
  });
};

export const fetchUserInfo = () => {
  return axiosIns.request({
    url: "/getCurrentUser ",
    method: "get",
  });
};

export const fetchDetail = (applyId) => {
  return axiosIns.request({
    url: "/getApplyDetails",
    params: { applyId },
    method: "get",
  });
};
