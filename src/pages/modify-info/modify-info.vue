<template>
  <van-nav-bar left-arrow title="修改个人信息" @clickLeft="handleGoback" />

  <van-cell
    is-link
    title="真实姓名"
    :value="userStore.userName"
    class="first-cell"
    @click="handleUpdateUserName"
  />

  <van-cell
    is-link
    title="手机号"
    :value="userStore.userPhone"
    class="first-cell"
    @click="handleUpdatePhone"
  />

  <van-cell
    title="身份证"
    :value="userStore.userIdentityCard"
    class="first-cell"
  />

  <van-cell
    is-link
    title="所属区域"
    :label="userStore.userRegionName"
    class="first-cell"
    @click="handleUpdateRegion"
  />

  <popup-info
    v-model:value="showUserNamePopup"
    title="修改真实姓名"
    :loading="userLoading"
    @sure="modifyUserName"
  >
    <van-field
      v-model="userName"
      label="真实姓名"
      size="large"
      placeholder="请输入姓名"
    />
  </popup-info>

  <popup-info
    v-model:value="showPhonePopup"
    title="修改手机号"
    :loading="phoneLoading"
    @sure="modifyPhone"
  >
    <van-field
      size="large"
      v-model="phone"
      label="手机号"
      placeholder="请输入手机号"
    />
  </popup-info>

  <region-picker
    v-model:value="showRegionPicker"
    @change="modifyRegion"
  ></region-picker>
</template>

<script setup>
import { computed, ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store";
import { RegionPicker } from "@/components";
import { PopupInfo } from "./components";
import { updateUserName, updatePhone, updateRegion } from "./services";

const userStore = useUserInfoStore();
/**
 * 人员id
 */
const userId = computed(() => userStore.userId);
/**
 * =======更新姓名=========
 */
const router = useRouter();
const handleGoback = () => {
  router.go(-1);
};

const userName = ref(userStore.userName);
const showUserNamePopup = ref(false);
const userLoading = ref(false);
const handleUpdateUserName = () => {
  showUserNamePopup.value = true;
};
const modifyUserName = async () => {
  if (!userName.value) {
    return;
  }
  try {
    userLoading.value = true;
    const { code, msg } = await updateUserName({
      id: userId.value,
      userName: userName.value,
    });
    if (code === 0) {
      showUserNamePopup.value = false;
      showSuccessToast("编辑成功");
      userStore.updateName(userName.value);
    } else {
      showFailToast("编辑失败");
    }
  } finally {
    userLoading.value = false;
  }
};

/**
 * =======更新手机号=========
 */
const phone = ref(userStore.userPhone);
const showPhonePopup = ref(false);
const phoneLoading = ref(false);
const handleUpdatePhone = () => {
  showPhonePopup.value = true;
};
const modifyPhone = async () => {
  if (!phone.value) {
    return;
  }
  try {
    userLoading.value = true;
    const { code, msg } = await updatePhone({
      id: userId.value,
      userPhone: phone.value,
    });
    if (code === 0) {
      showPhonePopup.value = false;
      showSuccessToast("编辑成功");
      userStore.updatePhone(phone.value);
    } else {
      showFailToast("编辑失败");
    }
  } finally {
    phoneLoading.value = false;
  }
};

/**
 * =======更新所属区域=========
 */
const showRegionPicker = ref(false);
const handleUpdateRegion = () => {
  showRegionPicker.value = true;
};
const modifyRegion = async (region) => {
  try {
    const { code } = await updateRegion({
      id: userId.value,
      regionId: region.regionId,
    });
    if (code === 0) {
      showSuccessToast("编辑成功");
      console.log(userStore.regionTag)
      if (userStore.regionTag === "user") {
        console.log("更新LINK_REGION");
        userStore.setLinkRegion(region);
      }
      userStore.updateRegion(region);
    } else {
      showFailToast("编辑失败");
    }
  } finally {
  }
};
</script>

<style scoped lang="scss">
.first-cell {
  padding-top: 20px;
  padding-bottom: 20px;
  :deep(.van-cell__title) {
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
    .van-cell__label {
      font-size: 15px;
    }
  }
  :deep(.van-cell__value) {
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
