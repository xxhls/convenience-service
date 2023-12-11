<template>
  <div class="page-apply">
    <van-nav-bar
      left-arrow
      :title="baseInfo.businessName"
      @clickLeft="handleGoback"
    />
    <step-bar :currentStep="currentStep" />
    <!-- <div class="van-hairline--bottom step-container"></div> -->
    <div class="main">
      <div v-if="currentStep === 1">
        <step-one :ref="refMap[1]" />
      </div>
      <div v-else-if="currentStep === 2">
        <step-two :ref="refMap[2]" />
      </div>
      <div v-else-if="currentStep === 3">
        <step-three :ref="refMap[3]" />
      </div>
      <div v-else-if="currentStep === 4">
        <step-four :ref="refMap[4]" />
      </div>
      <div v-else-if="currentStep === 5">
        <step-five />
      </div>
    </div>
    <div class="buttons">
      <div class="btn-item" v-if="currentStep !== 1 && currentStep !== 5">
        <van-button block round plain type="primary" @click="toPrev"
          >上一步</van-button
        >
      </div>
      <div class="btn-item">
        <van-button block round type="primary" @click="toNext">{{
          toNextLabel
        }}</van-button>
      </div>
    </div>
    <van-dialog
      class="dialog-back"
      message-align="center"
      @confirm="routerBack"
      v-model:show="returnDialog" 
      show-cancel-button
      confirm-button-color="#CC1D1D"
    >
      <van-image
         
        :src="iconWarn" 
        width="46" 
        height="46" 
         />
      <p>返回后您所填写的基本信息将会被清空，是否继续返回至首页</p>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, provide, reactive, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { nanoid } from "nanoid";
import { useUserInfoStore } from "@/store";
import { fetchDetail } from "@/services";
import {
  StepBar,
  StepTwo,
  StepThree,
  StepFour,
  StepOne,
  StepFive,
} from "./components";
import { FILE_SOURCE, APPLY_INFO_INJECT } from "./context";
import { showConfirmDialog } from "vant";
import iconWarn from "./assets/warn.png";

const route = useRoute();
const router = useRouter();
/**
 * 基本信息
 * 根据是否为已驳回的重新编辑选择数据源
 */
const baseInfo = reactive({
  businessName: "",
  businessId: "",
  applyUserName: "",
  applyUserPhone: "",
  identityCard: "",
  regionId: "",
  regionName: "",
  id: "",
  uploadFiles: [], //手动上传的文件
  fileIdList: [],
  fileSource: FILE_SOURCE.upload,
});
provide(APPLY_INFO_INJECT, baseInfo);

/** 提取路径参数 */
onBeforeMount(() => {
  const { id, businessId, businessName } = route.query;
  if (id) {
    currentStep.value = 2;
    getApplyDetail(id);
  } else {
    baseInfo.businessName = decodeURIComponent(businessName);
    baseInfo.businessId = businessId;
    getUserInfo();
    baseInfo.id = nanoid();
  }
});

/**
 * TODO 加载个人信息模块
 * * 入参:
 * ? @param {boolean} isRewrite 是否为重新编辑
 * ? @param {string} applyId 申请Id
 * ? @param {string | undefined} regionId 路径参数的区域Id
 * * 出参:
 * ? @return {BaseInfo} baseInfo 个人信息
 */
const getUserInfo = async () => {
  const userInfoStore = useUserInfoStore();
  baseInfo.applyUserName = userInfoStore.userName;
  baseInfo.applyUserPhone = userInfoStore.userPhone;
  baseInfo.identityCard = userInfoStore.userIdentityCard;
  baseInfo.regionId = userInfoStore.linkRegionId || userInfoStore.userRegionId;
  baseInfo.regionName =
    userInfoStore.linkRegionName || userInfoStore.userRegionName;
};

const getApplyDetail = async (id) => {
  const { code, data } = await fetchDetail(id);
  if (code === 0) {
    baseInfo.id = id;
    baseInfo.applyUserName = data.applyUserName;
    baseInfo.applyUserPhone = data.applyUserPhone;
    baseInfo.identityCard = data.identityCard;
    baseInfo.regionId = data.regionId;
    baseInfo.regionName = data.regionName;
    baseInfo.businessId = data.businessId;
    baseInfo.businessName = data.businessName;
    handleApplyFiles(data.applyFileViews);
  }
};

/**
 * 处理上传文件，跟申请时的逻辑保持一致性
 */
const handleApplyFiles = (files) => {
  if (files.length === 0) return;
  const uploadType = files[0].uploadType;
  baseInfo.fileSource = uploadType;
  if (uploadType === FILE_SOURCE.upload) {
    baseInfo.uploadFiles = files.map((item) => ({
      serverId: item.fileId,
    }));
  } else {
    baseInfo.fileIdList = files;
  }
};

/** 当前步骤 */
const currentStep = ref(1);

/** 上一步 */
function toPrev() {
  if (currentStep.value === 1) return;
  currentStep.value = currentStep.value - 1;
}

const toNextLabel = computed(() => {
  if (currentStep.value === 4) return "提交";
  if (currentStep.value === 5) return "我知道了";
  return "下一步";
});

const refMap = {
  1: ref(null),
  2: ref(null),
  3: ref(null),
  4: ref(null),
  5: ref(null),
};
const returnDialog = ref(false);
const routerBack = () => {
  router.go(-1);
}
const handleGoback = () => {
  returnDialog.value = true;
  // showConfirmDialog({
  //   theme: "round-button",
  //   className: "dialog-apply",
  //   message: "返回后您所填写的基本信息将会被清空，是否继续返回至首页",
  // })
  //   .then(() => {
  //     // on confirm
  //     router.go(-1);
  //   })
  //   .catch(() => {
  //     // on cancel
  //     return;
  //   });
};

/** 下一步 */
const toNext = async () => {
  if (currentStep.value === 5) {
    router.go(-1);
  }
  const curModuleRef = refMap[currentStep.value];
  await curModuleRef.value?.validate();
  currentStep.value = currentStep.value + 1;
};

/** ========== 独立模块结束 ========== */
</script>

<style scoped lang="scss">
.page-apply {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .step-container {
    margin: 30px 0;
  }
  .main {
    flex: 1;
    // height: clac(100vh-200px);
    overflow-y: scroll;
    padding-bottom: 20px;
  }
}
.buttons {
  // position: fixed;
  // bottom: 0;
  display: flex;
  width: 100%;
  padding: 0 16px 10px 16px;
  box-sizing: border-box;
  gap: 10px;
  background-color: #fff;
  .btn-item {
    flex: 1;
  }
}
</style>

<style lang="scss">
.dialog-apply {
  // width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  .van-dialog__content {
    // height: 100px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
  }
  .van-action-bar {
    // width: 200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    button {
      background-color: transparent;
      border-color: transparent;
      color: black;
    }
    button:nth-child(2) {
      color: #CC1D1D;
    }
  }
}
</style>

<style lang="scss">
.dialog-back {
  &>.van-dialog__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 28px 60px 28px;
  }
  p {
    line-height: 1.5;
  }
  button {
    border-top: 1px solid #D1D1D1;
  }
}
</style>
