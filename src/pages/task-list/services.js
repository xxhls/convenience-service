import { axiosIns } from "@/utils";

export const fetchTaskList = (creatorId, applyStatus) => {
  return axiosIns.request({
    url: "/queryApplyOverview",
    method: "POST",
    data: {
      creatorId,
      applyStatus,
    },
  });
};
