import { removeToken } from "@/utils";
import router from "@/router";
import { createHttpRequestInstance } from "./request";

/**
 * 响应拦截器
 * @param {*} response
 * @returns
 */
const repInterceptor = (response) => {
  const { config, data } = response;
  if (data?.code === 20022) {
    removeToken();
    router.push({
      name: "home",
    });
  }
  if (config.settings?.nativeResponse) return response;
  return data;
};

/**
 * 响应异常拦截器
 * @param {*} error
 * @returns
 */
const repInterceptorCatch = (error) => {
  return Promise.reject(error);
};

export const axiosIns = createHttpRequestInstance({
  repInterceptor,
  repInterceptorCatch,
  baseURL: SERVER_URL,
});
