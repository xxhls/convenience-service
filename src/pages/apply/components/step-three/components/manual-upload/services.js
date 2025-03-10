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
