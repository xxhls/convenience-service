<template>
  <div class="preview-box">
    <div v-if="isTemplete">
      <div v-if="html" v-html="html"></div>
    </div>
    <div v-else>
      <div class="img-box">
        <img v-for="(item, index) in imageList" :key="index" :src="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, nextTick, computed } from "vue";
import { nanoid } from "nanoid";
import { setToastDefaultOptions, resetToastDefaultOptions } from 'vant';
import { showLoadingToast, closeToast, showFailToast } from "vant";
import { loadImage } from "@/services";
import { getTempleteParams } from "../../services";
import { FILE_SOURCE, APPLY_INFO_INJECT } from "../../context";
import { create, generateDoc } from "./services";

const applyInfo = inject(APPLY_INFO_INJECT);
const html = ref("");
let templeteMeta = null;
const isTemplete = computed(
  () => applyInfo.fileSource === FILE_SOURCE.templete
);
const init = async () => {
  if (isTemplete.value) {
    const { code, data } = await getTempleteParams(applyInfo.businessId);
    if (code === 200) {
      templeteMeta = data;
      html.value = data.html;
      fillParamsValue(data.params);
    }
  } else {
    getImageList();
  }
};

/**
 * 填充参数的值
 */
const fillParamsValue = (params) => {
  nextTick(() => {
    for (let item of params) {
      const target = document.getElementById(item.id);
      target.setAttribute("value", applyInfo.paramsValue[item.id]);
      target.setAttribute("readonly", true);
    }
  });
};

/**
 * 获取图片列表
 */
const imageList = ref([]);
const getImageList = () => {
  const fileList = applyInfo.fileIdList;
  fileList?.map(async (item) => {
    const data = await loadImage(item);
    const url = window.URL.createObjectURL(new Blob([data]));
    imageList.value.push(url);
  });
};

/**
 * 生成文档
 */
const createDocument = async () => {
  if (!templeteMeta) {
    return Promise.reject("未绑定模板，无法创建文档");
  }
  templeteMeta.exampleId = nanoid();
  templeteMeta.applyName = applyInfo.businessName;
  templeteMeta.applyId = applyInfo.id;
  templeteMeta.params?.map((item) => {
    item.value = applyInfo.paramsValue[item.id];
  });
  const { code, data, msg } = await generateDoc(templeteMeta);
  if (code === 200) {
    return Promise.resolve(data);
  } else {
    return Promise.reject(msg);
  }
};

/**
 * 校验并且提交
 */
const validate = async () => {
  setToastDefaultOptions({ duration: 0 });
  showLoadingToast("提交中……");
  //如果是模板，要先生成文档
  if (applyInfo.fileSource === FILE_SOURCE.templete) {
    try {
      const fileId = await createDocument();
      applyInfo.fileIdList = fileId;
    } catch (error) {
      closeToast();
      showFailToast(error);
      return Promise.reject();
    }
  }
  try {
    const { code } = await create(applyInfo);
    if (code === 0) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  } finally {
    closeToast();
    resetToastDefaultOptions();
  }
};

defineExpose({
  validate,
});
init();
</script>

<style scoped lang="scss">
.preview-box {
  padding: 0 40px 20px 40px;
}
.img-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  img {
    max-width: 120px;
  }
}
</style>
