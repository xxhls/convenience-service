import { axiosIns } from "@/utils";

export const fetchBanners = () => {
  return axiosIns.request({
    url: "queryBannerList",
  });
};

export const loadBannerImage = (imgageId) => {
  return axiosIns.request({
    url: "directShowImage",
    params: { id: imgageId },
    responseType: "blob",
  });
};
