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
          type="primary"
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
import { isImage } from '@/utils';
import { loadImage } from '@/services';
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
.van-popup {
  padding-top: 20px!important;
  padding-bottom: 10px!important;
  padding-left: 16px!important;
  padding-right: 16px!important;
}
:deep(.van-cell) {
  margin-top: 30px;
  padding-left: 0!important;
  padding-right: 0!important;
  padding-top: 0px!important;
  padding-bottom: 6px!important;
  border-bottom: 1px solid #D1D1D1;
}
.popup-title {
  text-align: center;

  height: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  line-height: 22px;
}
.footer {
  margin: 44px 0 0px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .footer-item {
    flex: 1;
    
  }
  .footer-item:first-child {
    margin-right: 8px;
  }
  .footer-item:last-child {
    margin-left: 8px;
  }
}
</style>
