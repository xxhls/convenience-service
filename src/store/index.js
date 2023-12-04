import { defineStore } from "pinia";
import { fetchUserInfo } from "@/services";

export const useUserInfoStore = defineStore("userStore", {
  state: () => {
    return {
      hasGetInfo: false,
      userId: "",
      userName: "",
      userPhone: "",
      userIdentityCard: "",
      userRegionId: "",
      userRegionName: "",
      linkRegionId: "",
      linkRegionName: "",
      regionTag: "empty",
    };
  },
  actions: {
    updateName(userName) {
      this.userName = userName;
    },
    updatePhone(userPhone) {
      this.userPhone = userPhone;
    },
    updateRegion(region) {
      this.userRegionId = region.regionId;
      this.userRegionName = region.regionName;
    },
    setLinkRegion(region) {
      this.linkRegionId = region.regionId;
      this.linkRegionName = region.regionName;
    },

    setUserInfo(userInfo) {
      this.hasGetInfo = true;
      this.userId = userInfo.id;
      this.userName = userInfo.userName;
      this.userPhone = userInfo.userPhone;
      this.userIdentityCard = userInfo.identityCard;
      this.userRegionId = userInfo.regionId;
      this.userRegionName = userInfo.fullName;
    },
    async getUserInfo() {
      const { code, data } = await fetchUserInfo();
      if (code === 0) {
        this.setUserInfo(data);
      }
    },
    /**
     * 
     * @param {"empty" | "router" | "user"} tag 
     */
    setRegionTag(tag) {
      this.regionTag = tag;
    },
  },
});
