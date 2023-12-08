<template>
  <div class="qj-region-show">
    <img class="icon" :src="iconAddress" />
    <view class="text">
      {{ regionName || "暂未获取到地址" }}
    </view>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import iconAddress from "./assets/address.png";

const props = defineProps({
  regionName: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.qj-region-show {
  height: 36px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding: 10px 20px;
  background-color: #fdf3f3;
  .icon {
    width: 16px;
    height: 16px;
  }
  .text {
    flex-grow: 1;
    text-overflow: ellipsis;
    padding-left: 6px;
    width: 168px;
    height: 17px;
    font-size: 12px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 16px;
  }
}
</style>
