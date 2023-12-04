<template>
  <van-popup :show="props.value" round position="bottom" class="login-popup">
    <div class="title">确认基本信息</div>
    <van-form ref="registerForm">
      <van-field
        v-model="registerModel.userName"
        size="large"
        class="mb-40"
        required
        center
        clearable
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
      </van-field>
      <van-field
        required
        v-model="registerModel.userPhone"
        size="large"
        type="tel"
        class="mb-40"
        center
        clearable
        label="手机号"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
      </van-field>
      <van-field
        v-model="registerModel.identityCard"
        size="large"
        class="mb-40"
        center
        clearable
        label="身份证号"
        placeholder="请输入身份证号"
      >
      </van-field>
      <van-field
        required
        v-model="registerModel.regionName"
        is-link
        readonly
        size="large"
        class="mb-40"
        center
        clearable
        label="所属区域"
        placeholder="请选择所属区域"
        :rules="[{ required: true, message: '请选择所属区域' }]"
        @click="openRegionPicker"
      >
      </van-field>
      <van-button
        type="primary"
        round
        block
        :loading="loading"
        @click="handleRegister"
        >保存</van-button
      >
    </van-form>
    <RegionPicker
      v-model:value="showRegionPicker"
      @change="handleGetRegion"
    ></RegionPicker>
  </van-popup>
</template>

<script setup>
import { defineProps, ref, reactive, defineEmits } from "vue";
import { RegionPicker } from "@/components";
import { setToken } from "@/utils";
import { useUserInfoStore } from "@/store";
import { register } from "./services";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["register:success"]);

const store = useUserInfoStore();
const registerForm = ref(null);
const registerModel = reactive({
  userName: "",
  userPhone: "",
  identityCard: "",
  regionId: store.linkRegionId,
  regionName: store.linkRegionName,
});

const showRegionPicker = ref(false);
const openRegionPicker = () => {
  showRegionPicker.value = true;
};
const handleGetRegion = ({ regionId, regionName }) => {
  registerModel.regionId = regionId;
  registerModel.regionName = regionName;
};

const loading = ref(false);
const handleRegister = async () => {
  try {
    await registerForm.value.validate();
    loading.value = true;
    const { code, token, user } = await register(registerModel);
    if (code === 0) {
      setToken(token);
      emit("register:success", user);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-popup {
  padding: 40px 20px;
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
    text-align: center;
    margin-bottom: 50px;
  }
  .mb-40 {
    margin-bottom: 40px;
  }
}
</style>
