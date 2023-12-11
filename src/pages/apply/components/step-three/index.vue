<template>
  <div class="file-source_box">
    <van-collapse accordion v-model="applyInfo.fileSource" :border="false">
      <van-collapse-item
        title="我已有文件，信息已填，需要拍照上传"
        :name="FILE_SOURCE.upload"
        :lazy-render="false"
      >
        <manual-upload></manual-upload>
      </van-collapse-item>
      <van-collapse-item
        title="我没有文件，根据要求填写信息"
        :name="FILE_SOURCE.templete"
        :lazy-render="false"
        :disabled="noTemplete"
      >
        <fill-templete-params ref="FileTempleteParamsRef"> </fill-templete-params>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { computed, inject } from "vue";
import { showFailToast } from "vant";
import { FILE_SOURCE, APPLY_INFO_INJECT } from "../../context";
import { FillTempleteParams, ManualUpload } from "./components";
import { getTempleteParams } from "./services";

const applyInfo = inject(APPLY_INFO_INJECT);
const fileSource = computed(() => applyInfo.fileSource);

const noTemplete = ref(false);
const getParams = async () => {
  const { code, data } = await getTempleteParams(applyInfo.businessId);
  if (code === 200) {
    // paramsHanlder(data.params);
  } else if (code === 30001) {
    noTemplete.value = true;
    console.log(noTemplete.value);
  }
};

const FileTempleteParamsRef = ref(null);

const validate = () => {
  if (fileSource.value === FILE_SOURCE.upload) {
    if (applyInfo.uploadFiles?.length === 0) {
      showFailToast("请上传文件");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if (fileSource.value === FILE_SOURCE.templete) {
    return FileTempleteParamsRef.value.validate();
  }
  return Promise.resolve();
};

defineExpose({
  validate,
});
window.scrollTo(0, 0)
getParams();
</script>

<style scoped lang="scss">
.file-source_box {
  margin-top: 20px;
  padding: 0 0px;
  :deep(.van-radio__label) {
    flex: 1;
  }
  .file-source {
    width: 100%;
  }
}
.create-file_box {
  margin-top: 20px;
}
</style>
