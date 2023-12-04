import axios from "axios";
import { getToken } from "@/utils";

const defaultSettings = {
  nativeResponse: false,
  isAuth: true,
};

const defaultReqInterceptor = (config) => {
  const requestSettings = config?.settings;
  if (requestSettings.isAuth) {
    config.headers.token = getToken();
  }
  return config;
};

const defaultReqInterceptorCatch = (error) => {
  return Promise.reject(error);
};

class HttpRequest {
  config;
  interceptors;
  instance;

  constructor(config) {
    this.interceptors = config.interceptors;
    delete config.interceptors;
    this.config = { ...config };
    this.instance = axios.create(config);
    this.instance.defaults.headers.common = {
      timeStamp: new Date().getTime(),
      loginType: "CP",
    };
    this.instance.defaults.timeout = 10 * 1000;
    this.setupInterceptors();
  }

  setupInterceptors() {
    const { req, rep } = this.interceptors;
    if (req) {
      this.instance.interceptors.request.use(req[0], req[1]);
    }
    this.instance.interceptors.request.use(
      defaultReqInterceptor,
      defaultReqInterceptorCatch
    );
    if (rep) {
      this.instance.interceptors.response.use(rep[0], rep[1]);
    }
  }

  request(requestConfig) {
    const settings = Object.assign({}, defaultSettings, requestConfig.settings);
    requestConfig.settings = settings;
    return new Promise((resolve, reject) => {
      this.instance
        .request(requestConfig)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export const createHttpRequestInstance = ({
  baseURL,
  reqInterceptor,
  reqInterceptorCatch = defaultReqInterceptorCatch,
  repInterceptor,
  repInterceptorCatch,
}) => {
  let req = null;
  if (reqInterceptor) {
    req = [reqInterceptor, reqInterceptorCatch];
  }
  let rep = null;
  if (repInterceptor && repInterceptorCatch) {
    rep = [repInterceptor, repInterceptorCatch];
  }

  return new HttpRequest({
    baseURL,
    interceptors: {
      req,
      rep,
    },
  });
};
