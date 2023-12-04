<template>
  <van-form v-if="!noParams && !noTemplete" class="templete-form">
    <van-field
      v-for="item in params"
      :key="item.id"
      v-model="applyInfo.paramsValue[item.id]"
      size="large"
      :label="item.name"
      :placeholder="item.description"
    />
  </van-form>
  <van-empty v-if="noTemplete" image-size="250" description="暂未绑定模板" />
  <van-empty v-if="noParams" image-size="250" description="该模板没有参数" />
</template>

<script setup>
import { inject, ref } from "vue";
import { getTempleteParams, fetchFilledParamValues } from "./services";
import { APPLY_INFO_INJECT } from "../../../../context";

const params = ref([]);
const applyInfo = inject(APPLY_INFO_INJECT);

/**
 * 参数处理方法
 * @param {*} params
 */
const paramsHanlder = (data) => {
  params.value = data;
  const paramsModel = {};
  for (let item of data) {
    paramsModel[item.id] = item.value;
  }
  applyInfo.paramsValue = paramsModel;
};

const noTemplete = ref(false);
const noParams = ref(false);

const getParams = async () => {
  const { code, data } = await getTempleteParams(applyInfo.businessId);
  if (code === 200) {
    if (data.params.length === 0) {
      noParams.value = true;
    }
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
  if (applyInfo.fileIdList?.length > 0) {
    const first = applyInfo.fileIdList[0];
    getFilledValues(first);
  } else {
    getParams();
  }
};
init();
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
</style>
