import { defineStore } from "pinia";
import { fetchUserInfo } from "@/services";
import { updateIdentityCard } from './../pages/modify-info/services';

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
      loginStatus: false,
    };
  },
  actions: {
    toogleLoginStatus(status) {
      this.loginStatus = status;
    },
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
    updateIdentityCard(identityCard) {
      this.userIdentityCard = identityCard;
    },
    updateLoginStatus(status) {
      this.loginStatus = status;
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
    resetUserInfo() {
      this.hasGetInfo = false;
      this.userId = "";
      this.userName = "";
      this.userPhone = "";
      this.userIdentityCard = "";
      this.userRegionId = "";
      this.userRegionName = "";
      this.linkRegionId = "";
      this.linkRegionName = "";
      this.loginStatus = false;
    },
  },
});
