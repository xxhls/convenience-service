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
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fdf3f3;
  .text {
    flex-grow: 1;
    text-overflow: ellipsis;
    font-size: 20px;
    font-weight: 400;
    color: #000000;
    padding-left: 12px;
  }
}
</style>
