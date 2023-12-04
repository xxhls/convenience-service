<template>
  <div class="complete-box">
    <img :src="CompletePng" />
    <div class="complete-text">您的{{ baseInfo.businessName }}申请已提交</div>
    <ul class="des mt-50">
      <li class="mb-20">您的申请已进入到审核阶段；</li>
      <li>
        您可以在【便民服务平台】> 我的 > 受理中，找到该申请并下载盖章材料。
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { APPLY_INFO_INJECT } from "../../context";
import CompletePng from "./assets/complete.png";

const baseInfo = inject(APPLY_INFO_INJECT);
</script>

<style scoped lang="scss">
.complete-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.complete-text {
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
  color: #000000;
}
.mb-20 {
  margin-bottom: 20px;
}
.mt-50 {
  margin-top: 50px;
}
.des {
  background-color: rgba(230, 230, 230, 0.2);
  padding: 30px;
  font-size: 14px;
  list-style: disc;
  li {
    color: rgba(0, 0, 0, 1);
    font-weight: 400;
    &::marker {
      color: rgba(204, 29, 29, 1);
    }
  }
}
</style>
