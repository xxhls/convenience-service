<template>
  <van-popup :show="props.value" round position="bottom" class="login-popup">
    <div class="title">用户登录</div>
    <van-form>
      <van-field
        v-model="loginModel.phoneNumber"
        size="large"
        type="tel"
        class="mb-40"
        center
        clearable
        placeholder="请输入手机号"
        :rules="[
          { pattern: phonePattern, message: '请输入正确手机号' },
          { required: true, message: '请输入手机号' },
        ]"
      >
        <template #left-icon>
          <img :src="PhoneIcon" />
        </template>
      </van-field>
      <van-field
        v-model="loginModel.smsCode"
        size="large"
        center
        clearable
        class="mb-20"
        placeholder="请输入短信验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #left-icon>
          <img :src="CodeIcon" />
        </template>
        <template #button>
          <van-button
            v-if="!codeSended"
            :disabled="sendCodeDisabled"
            size="small"
            type="primary"
            :loading="codeLoading"
            @click="handleSendCode"
            >发送验证码</van-button
          >
          <van-count-down
            v-else
            :time="60 * 1000"
            format="ss s"
            @finish="handleCountdownFinish"
          />
        </template>
      </van-field>

      <van-field class="mb-80">
        <template #input>
          <van-radio-group v-model="readed">
            <van-radio :name="true">
              <div class="readme">
                <span>我已阅读并同意</span>
                <span class="weight">《隐私协议》</span>
              </div>
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </van-form>
    <van-button
      type="primary"
      round
      block
      :loading="loginLoading"
      :disabled="loginBtnDisabled"
      @click="handleLogin"
      >登录</van-button
    >
  </van-popup>
</template>

<script setup>
import { defineProps, computed, ref, reactive, defineEmits } from "vue";
import { phonePattern, setToken } from "@/utils";
import { CodeIcon, PhoneIcon } from "./assets";
import { sendCode, login } from "./services";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["login:success", "update:value", "login:register"]);
const loginModel = reactive({
  phoneNumber: "",
  smsCode: "",
});
const codeSended = ref(false);
const codeLoading = ref(false);
const sendCodeDisabled = computed(() => {
  return !phonePattern.test(loginModel.phoneNumber);
});
const handleSendCode = async () => {
  console.log("发送验证码");
  try {
    codeLoading.value = true;
    console.log(loginModel.phoneNumber)
    debugger
    const { code } = await sendCode(loginModel.phoneNumber);
    if (code === 20201) {
      codeSended.value = true;
    }
  } finally {
    codeLoading.value = false;
  }
};

const handleCountdownFinish = () => {
  codeSended.value = false;
};

const readed = ref(false);
const loginBtnDisabled = computed(() => {
  return !(!sendCodeDisabled.value && loginModel.smsCode && readed.value);
});
const loginLoading = ref(false);
const handleLogin = async () => {
  try {
    loginLoading.value = false;
    const { phoneNumber, smsCode } = loginModel;
    const { code, token, user } = await login(phoneNumber, smsCode);
    if (code === 0) {
      setToken(token);
      emit("update:value", false);
      emit("login:success", user);
    } else if (code === 20020) {
      emit("update:value", false);
      emit("login:register");
    }
  } finally {
    loginLoading.value = true;
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
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-80 {
    margin-bottom: 80px;
  }
  img {
    width: 20px;
    display: flex;
  }
  .readme {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    .weight {
      color: #cc1d1d;
    }
  }
}
</style>
