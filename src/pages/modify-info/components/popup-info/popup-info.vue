<template>
  <van-popup
    round
    :show="props.value"
    :style="popupStyle"
    position="bottom"
    @close="handleClose"
  >
    <div class="popup-title">{{ props.title }}</div>
    <slot></slot>

    <div class="footer">
      <div class="footer-item">
        <van-button block round type="default" @click="handleClose"
          >取消</van-button
        >
      </div>
      <div class="footer-item">
        <van-button
          block
          round
          type="danger"
          :loading="props.loading"
          @click="handleOk"
          >确定</van-button
        >
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:value", "sure"]);
const popupStyle = {
  padding: "30px 10px",
};
const handleOk = () => {
  emit("sure");
};
const handleClose = () => {
  emit("update:value", false);
};
</script>

<style lang="scss" scoped>
.popup-title {
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  margin-bottom: 40px;
}
.footer {
  margin: 60px 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .footer-item {
    flex: 1;
    padding: 0 20px;
  }
}
</style>
