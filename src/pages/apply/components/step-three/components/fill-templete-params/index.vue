<template>
  <div v-if="!noParams" class="title3">请填写基本信息：</div>
  <van-form ref="formRef" v-if="!noParams && !noTemplete" class="input-form">
    <van-field
      v-for="item in params"
      required
      :key="item.id"
      v-model="applyInfo.paramsValue[item.id]"
      size="large"
      :label="item.name"
      label-align="top"
      :placeholder="item.description"
      :rules="[{ required: true, message: '请填写必备参数' }]"
    />
  </van-form>
  <van-empty v-if="noParams" image-size="250" description="该模板没有参数" />
  <div v-if="noParams" class="tips">
    无需填写信息，可以直接点击<span style="color: #CC1D1D;">“下一步”</span>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { getTempleteParams, fetchFilledParamValues } from "./services";
import { APPLY_INFO_INJECT, FILE_SOURCE } from "../../../../context";

const formRef = ref();
const params = ref([]);
const applyInfo = inject(APPLY_INFO_INJECT);

/**
 * 参数处理方法
 * @param {*} params
 */
const paramsHanlder = (data) => {
  if (data?.length === 0) {
    noParams.value = true;
  } else {
    params.value = data;
    if (!applyInfo.paramsValue) {
      applyInfo.paramsValue = data?.reduce((pre, cur) => {
        pre[cur.id] = cur.value;
        return pre;
      }, {});
    }
  }
};

const noTemplete = ref(false);
const noParams = ref(false);

const getParams = async () => {
  const { code, data } = await getTempleteParams(applyInfo.businessId);
  if (code === 200) {
    paramsHanlder(data.params);
  } else if (code === 30001) {
    noTemplete.value = true;
  }
};

/**
 * 获取填写好的值
 */
const getFilledValues = async (fileId) => {
  const { code, data } = await fetchFilledParamValues(fileId);
  if (code === 0) {
    paramsHanlder(data);
  }
};

const init = async () => {
  const { fileIdList, fileSource } = applyInfo;
  if (fileIdList?.length > 0 && fileSource === FILE_SOURCE.templete) {
    const first = fileIdList[0];
    getFilledValues(first.fileId);
  } else {
    getParams();
  }
};
init();

const validate = async () => {
  if (!formRef.value) return Promise.resolve();
  try {
    await formRef.value.validate();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};

defineExpose({
  validate,
});
</script>
<style lang="scss" scoped>
.templete-form {
  :deep(.van-cell) {
    padding-left: 0;
    &::after {
      left: 0;
    }
  }
}
.input-form {
  :deep(.van-field) {
    padding: 0;
  }
  :deep(.van-cell__title) {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 20px;
    margin-bottom: 0;
  }
  :deep(.van-cell__value) {
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #D1D1D1;
    border-radius: 6px;
  }
}
.title3 {
  padding: 0 0px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  line-height: 20px;
  margin-bottom: 20px;
}
.tips {
  width: 100%;
  text-align: center;
  height: 40px;
  line-height: 40px;
  background-color: #E6E6E6;
  font-size: 14px;
  font-weight: 400;
  color: #000;
}
</style>
