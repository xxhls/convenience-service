<template>
  <p class="title">{{ applyInfo.businessName }}流程：</p>
  <div class="pg-business-step-one">
    <div v-if="tipsHTML" class="html__container" v-html="tipsHTML"></div>
    <div class="readme-box">
      <van-radio-group v-model="isRead">
        <van-radio :name="true">我已知悉以上内容</van-radio>
      </van-radio-group>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, defineExpose, watch } from "vue";
import { showFailToast } from "vant";
import { getReadMe } from "./services";
import { APPLY_INFO_INJECT } from "../../context";

const applyInfo = inject(APPLY_INFO_INJECT);
const tipsHTML = ref("");

watch(
  () => applyInfo,
  () => {
    fetchReadMe();
  },
  {
    deep: true,
  }
);

const fetchReadMe = async () => {
  console.log(applyInfo)
  if (!applyInfo.businessId) return;
  const { code, data } = await getReadMe(applyInfo.businessId);
  if (code === 0) {
    tipsHTML.value = data;
  }
};

const isRead = ref(false);

const validate = () => {
  if (isRead.value) return Promise.resolve();
  showFailToast("请阅读业务办理需知，并勾选“我已知悉以上内容”");
  return Promise.reject();
};
defineExpose({
  validate,
});
fetchReadMe();
window.scrollTo(0, 0)
</script>
<style lang="scss">
.title {
  padding: 0 16px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  line-height: 20px;
}
.pg-business-step-one {
  padding: 0 16px;
  .title {
    font-weight: bold;
    color: #000000;
  }
  .html__container {
    padding-bottom: 20px;
    box-sizing: border-box;
    overflow: hidden;
    img {
      width: 100% !important;
    }
  }
}
</style>
