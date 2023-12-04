import { axiosIns } from "@/utils";

export const fetchBusiness = () => {
  return axiosIns.request({
    url: "queryBusiness",
  });
};
