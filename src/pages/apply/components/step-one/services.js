import { axiosIns } from "@/utils";

export const getReadMe = (businessId) => {
  return axiosIns.request({
    url: `/getHandleTips?businessId=${businessId}`,
  });
};
