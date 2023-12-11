<template>
  <p class="title">请填写基本信息：</p>
  <van-form ref="formRef">
    <van-cell-group inset>
      <van-field
        size="large"
        required
        v-model="formData.applyUserName"
        label="姓名"
        label-align="top"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        required
        size="large"
        type="tel"
        v-model="formData.applyUserPhone"
        label="手机号"
        label-align="top"
        placeholder="请输入手机号"
        :rules="[
          { pattern: phoneReg, message: '请输入正确手机号'},
          { required: true, message: '请输入手机号' }]"
      />
      <van-field
        v-model="formData.identityCard"
        size="large"
        label="身份证号"
        label-align="top"
        placeholder="请输入身份证号"
        :rules="[
          { pattern: idReg, message: '请输入正确身份证号' },
          { required: false, message: '请输入身份证号' }]"
      />

      <van-field
        required
        readonly
        is-link
        v-model="formData.regionName"
        size="large"
        label="所属区域"
        placeholder="请选择所属区域"
        label-align="top"
        :rules="[{ required: true, message: '请选择所属区域' }]"
        @click="openRegionPicker"
      />
    </van-cell-group>
  </van-form>
  <region-picker
    v-model:value="showRegionPicker"
    @change="handleGetRegion"
  ></region-picker>
</template>

<script setup>
import { inject, ref, defineExpose } from "vue";
import { RegionPicker } from "@/components";
import { APPLY_INFO_INJECT } from "../../context";

/** 表单参数 */
const formData = inject(APPLY_INFO_INJECT);
const formRef = ref(null);

const showRegionPicker = ref(false);
const openRegionPicker = () => {
  showRegionPicker.value = true;
};
const handleGetRegion = ({ regionId, regionName }) => {
  formData.regionId = regionId;
  formData.regionName = regionName;
};
const validate = async () => {
  return formRef.value.validate();
};


const phoneReg = /^1[3-9]\d{9}$/;
const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)|(^$)/;
defineExpose({
  validate,
});
window.scrollTo(0, 0)
</script>

<style scoped lang="scss">
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
</style>
