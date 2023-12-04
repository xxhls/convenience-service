<template>
  <div class="file-source_box">
    <van-collapse accordion v-model="applyInfo.fileSource" :border="false">
      <van-collapse-item
        title="我已有文件，信息已填，需要拍照上传"
        :name="FILE_SOURCE.upload"
      >
        <van-uploader
          v-model="fileList"
          :before-read="beforeRead"
          :after-read="afterRead"
          @delete="handleUploadDelete"
        >
        </van-uploader>
      </van-collapse-item>
      <van-collapse-item
        title="我没有文件，根据要求填写信息"
        :name="FILE_SOURCE.templete"
      >
        <fill-templete-params> </fill-templete-params>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { showFailToast } from "vant";
import { loadImage } from "@/services";
import { FILE_SOURCE } from "../../context";
import { deleteFileById, uploadFile } from "./services";
import { FillTempleteParams } from "./components";
import { APPLY_INFO_INJECT } from "../../context";

const applyInfo = inject(APPLY_INFO_INJECT);
const fileSource = computed(() => applyInfo.fileSource);

const fileList = ref([]);
const beforeRead = (file) => {
  const allowTypes = ["image/jpeg"];
  if (!allowTypes.includes(file.type)) {
    return false;
  }
  return true;
};

const afterRead = async (file) => {
  file.status = "uploading";
  file.message = "上传中……";
  const { code, data } = await uploadFile(file.file, applyInfo.id);
  if (code === 0) {
    file.message = "";
    file.status = "done";
    file.serverId = data;
  }
};

const handleUploadDelete = async (file) => {
  await deleteFileById(file.serverId);
};

const validate = () => {
  if (fileSource.value === FILE_SOURCE.upload) {
    if (fileList.value?.length === 0) {
      showFailToast("请上传文件");
      return Promise.reject();
    } else {
      applyInfo.fileIdList = fileList.value?.map((item) => item.serverId);
    }
    return Promise.resolve();
  }
  return Promise.resolve();
};

/**
 * 加载文件
 */
const init = () => {
  applyInfo.fileIdList?.map(async (item) => {
    const data = await loadImage(item);
    const url = window.URL.createObjectURL(data);
    fileList.value.push({
      url,
      serverId: item,
      message: "",
      status: "done",
      isImage: true,
    });
  });
};

defineExpose({
  validate,
});

init();
</script>

<style scoped lang="scss">
.file-source_box {
  padding: 0 20px;
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
