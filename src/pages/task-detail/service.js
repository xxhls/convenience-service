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

export const fetchSealImages = (id) => {
  return axiosIns.request({
    url: "/queryUsedSealInfo",
    method: "post",
    data: {
      id,
    },
  });
};

export const loadSealImage = (imgageId) => {
  return axiosIns.request({
    url: "directShowImage",
    params: { id: imgageId },
    responseType: "blob",
  });
};
