<template>
  <van-popup
    :show="props.value"
    round
    closeable
    position="bottom"
    class="login-popup"
    @close="handleClose"
  >
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
        type="digit"
        center
        clearable
        class="mb-20"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #left-icon>
          <img :src="CodeIcon" />
        </template>
        <template #button>
          <van-button
            class="sendsms-button"
            v-if="!codeSended && !busy"
            :disabled="sendCodeDisabled"
            size="small"
            type="primary"
            :loading="codeLoading"
            plain
            @click.stop="handleSendCode"
            :style="{
              color: sendCodeDisabled ? '#B4B4B4' : '#CC1D1D',
            }"
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
import { showFailToast, showSuccessToast } from "vant";
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
const busy = ref(false);
const handleSendCode = async () => {
  try {
    codeLoading.value = true;
    const { code } = await sendCode(loginModel.phoneNumber);
    if (code === 20201) {
      codeSended.value = true;
    } else if (code === 20209) {
      showFailToast("短信发送请求太频繁，请稍后再试");
      busy.value = true;
      setTimeout(() => {
        busy.value = false;
      }, 60 * 1000);
    } else {
      showFailToast("验证码发送失败");
    }
  } finally {
    codeLoading.value = false;
  }
};

const handleCountdownFinish = () => {
  codeSended.value = false;
};

// const readed = ref(false);
const loginBtnDisabled = computed(() => {
  // return !(!sendCodeDisabled.value && loginModel.smsCode && readed.value);
  return !(!sendCodeDisabled.value && loginModel.smsCode);
});
const loginLoading = ref(false);
const handleLogin = async () => {
  try {
    loginLoading.value = false;
    const { phoneNumber, smsCode } = loginModel;
    const { code, token, user } = await login(phoneNumber, smsCode);
    if (code === 0) {
      setToken(token);
      handleClose();
      emit("login:success", user);
    } else if (code === 20020) {
      handleClose();
      emit("login:register");
    } else if (code === 20016) {
      loginLoading.value = false;
      showFailToast("验证码错误");
    } else {
      loginLoading.value = false;
      showFailToast("登录失败");
    }
  } finally {
    loginLoading.value = false;
  }
};

const handleClose = () => {
  emit("update:value", false);
  loginModel.phoneNumber = "";
  loginModel.smsCode = "";
};
</script>

<style lang="scss" scoped>
.sendsms-button {
  color: #CC1D1D;
  border-color: white;
  font-size: 14px;
  font-weight: 400;
  color: #B4B4B4;
}
.login-popup {
  padding: 20px 16px 10px;
  .title {
    text-align: center;
    margin-bottom: 50px;

    height: 22px;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 22px;

  }
  .mb-40 {
    border-bottom: 1px solid #D1D1D1;
    margin-bottom: 52px;
    padding: initial;
    padding-bottom: 12px;
    padding-left: 10px;
    :deep(input) {
      font-size: 14px;
      font-weight: 400;
      color: #000;
      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #B4B4B4;
      }
    }
  }
  .mb-20 {
    border-bottom: 1px solid #D1D1D1;
    margin-bottom: 52px;
    padding: initial;
    padding-bottom: 12px;
    padding-left: 10px;
    :deep(input) {
      font-size: 14px;
      font-weight: 400;
      color: #000;
      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #B4B4B4;
      }
    }
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
