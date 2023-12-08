import { axiosIns } from "@/utils";

export const uploadFile = (file, applyId) => {
  const formData = new FormData();
  formData.append("applyId", applyId);
  formData.append("file", file);
  return axiosIns.request({
    url: "uploadFile",
    method: "POST",
    data: formData,
  });
};

export const deleteFileById = (id) => {
  return axiosIns.request({
    url: "/deleteFile",
    method: "POST",
    data: {
      id,
    },
  });
};

export const getTempleteParams = (templeteId) => {
  return axiosIns.request({
    url: `getTemplate?businessId=${templeteId}`,
    method: "GET",
  });
};
