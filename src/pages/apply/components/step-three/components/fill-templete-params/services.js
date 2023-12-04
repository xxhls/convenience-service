import { axiosIns } from "@/utils";

export const getTempleteParams = (templeteId) => {
  return axiosIns.request({
    url: `getTemplate?businessId=${templeteId}`,
    method: "GET",
  });
};

export const fetchFilledParamValues = (fileId) => {
  return axiosIns.request({
    url: "/getTemplateParams",
    params: {
      fileId,
    },
    method: "get",
  });
};
