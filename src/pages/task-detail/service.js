import { axiosIns } from "@/utils";

export const download = (fileId) => {
  return axiosIns.request({
    url: "/downLoadFile",
    params: {
      fileId,
    },
    method: "get",
    responseType: "blob",
  });
};
