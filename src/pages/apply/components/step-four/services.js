import { axiosIns } from "@/utils";

/**
 * 创建申请
 * @param {*} data
 * @returns
 */
export const create = (data) => {
  return axiosIns.request({
    url: "addApply",
    data,
    method: "post",
    timeout: 0,
  });
};

/**
 * 生成文档
 * @param {*} data
 */
export const generateDoc = (data) => {
  return axiosIns.request({
    url: "/createDocument",
    method: "POST",
    data: [data],
    timeout: 0,
  });
};
