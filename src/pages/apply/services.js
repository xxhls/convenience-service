import { axiosIns } from "@/utils";

export const getTempleteParams = (templeteId) => {
  return axiosIns.request({
    url: `/getTemplate?businessId=${templeteId}`,
    method: "GET",
  });
};
