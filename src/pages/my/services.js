import { axiosIns } from "@/utils";

export const fetchTaskNums = (userId) => {
  return axiosIns.request({
    url: "/myHandling",
    params: {
      userId,
    },
  });
};
