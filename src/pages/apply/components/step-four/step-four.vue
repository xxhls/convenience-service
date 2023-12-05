<template>
  <div class="preview-box">
    <div v-if="isTemplete">
      <div v-if="html" v-html="html"></div>
    </div>
    <div v-else>
      <div class="img-box">
        <img
          v-for="(item, index) in imageList"
          :key="index"
          :src="item"
          @click="previewImage(index)"
        />
      </div>
    </div>
    <van-overlay :show="show" />
  </div>
</template>

<script setup>
import { Overlay } from 'vant';
import { inject, ref, nextTick, computed } from "vue";
import { nanoid } from "nanoid";
import {
  showLoadingToast,
  closeToast,
  showFailToast,
  showImagePreview,
} from "vant";
import { loadImage, deleteFileById } from "@/services";
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
  const fileList = applyInfo.uploadFiles;
  fileList?.map(async (item) => {
    const data = await loadImage(item.serverId);
    const url = window.URL.createObjectURL(new Blob([data]));
    imageList.value.push(url);
  });
};

const previewImage = (idx) => {
  // showImagePreview([url]);
  showImagePreview({
    images: imageList.value,
    startPosition: idx,
  });
};

/**
 * 清理手动上传的文件
 */
const clearManualFiles = () => {
  for (let item of applyInfo.uploadFiles) {
    deleteFileById(item.serverId);
  }
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
const show = ref(false);
const validate = async () => {
  showLoadingToast({
    duration: 0,
    message: "提交中……",
  });
  show.value = true;
  //如果是模板，要先生成文档
  if (applyInfo.fileSource === FILE_SOURCE.templete) {
    try {
      clearManualFiles();
      const fileId = await createDocument();
      applyInfo.fileIdList = fileId;
    } catch (error) {
      closeToast();
      showFailToast(error);
      return Promise.reject();
    }
  } else {
    applyInfo.fileIdList = applyInfo.uploadFiles?.map((item) => item.serverId);
  }
  try {
    const { code } = await create(applyInfo);
    show.value = false;
    if (code === 0) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  } finally {
    closeToast();
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
  gap: 20px;
  img {
    max-width: 100%;
    display: block;
  }
}
</style>
