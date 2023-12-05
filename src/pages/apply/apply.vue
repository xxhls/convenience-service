<template>
  <div class="page-apply">
    <van-nav-bar
      left-arrow
      :title="baseInfo.businessName"
      @clickLeft="handleGoback"
    />
    <step-bar :currentStep="currentStep" />
    <div class="van-hairline--bottom step-container"></div>
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
        <van-button block round type="danger" @click="toNext">{{
          toNextLabel
        }}</van-button>
      </div>
    </div>
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
  baseInfo.fileIdList = files;
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
const handleGoback = () => {
  router.go(-1);
};
/** 下一步 */
const toNext = async () => {
  if (currentStep.value === 5) {
    handleGoback();
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
  }
}
.buttons {
  display: flex;
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  gap: 10px;
  .btn-item {
    flex: 1;
  }
}
</style>
