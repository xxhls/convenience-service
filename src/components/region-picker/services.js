import { axiosIns } from "@/utils";

export const queryRegionTree = async (parentId) => {
  return axiosIns.request({
    url: "/queryRegionTree",
    params: {
      parentId,
    },
    method: "get",
  });
};
