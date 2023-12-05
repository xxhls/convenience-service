<template>
  <van-uploader
    multiple
    v-model="applyInfo.uploadFiles"
    :before-read="beforeRead"
    :after-read="afterRead"
    upload-text="点击上传"
    accept="image/*"
    @delete="handleUploadDelete"
  >
  </van-uploader>
</template>

<script setup>
import { inject } from "vue";
import { loadImage, deleteFileById } from "@/services";
import { APPLY_INFO_INJECT, FILE_SOURCE } from "../../../../context";
import { uploadFile } from "./services";

const applyInfo = inject(APPLY_INFO_INJECT);

const beforeRead = (file) => {
  const allowTypes = ["image/jpeg"];
  const final = Array.isArray(file) ? file : [file];
  const validateResult = final.every((item) => allowTypes.includes(item.type));
  if (!validateResult) {
    return false;
  }
  return true;
};

const afterRead = async (file) => {
  const final = Array.isArray(file) ? file : [file];
  final.map(async (item) => {
    item.status = "uploading";
    item.message = "上传中……";
    const { code, data } = await uploadFile(item.file, applyInfo.id);
    if (code === 0) {
      item.message = "";
      item.status = "done";
      item.serverId = data;
    }
  });
};

const handleUploadDelete = async (file) => {
  await deleteFileById(file.serverId);
};

/**
 * 加载文件
 */
const init = () => {
  // applyInfo.uploadFiles = [];
  if (FILE_SOURCE.upload === applyInfo.fileSource) {
    if (applyInfo.fileIdList.length !== 0) {
      return;
    }
    applyInfo.fileIdList?.map(async (item) => {
      const data = await loadImage(item.fileId);
      const url = window.URL.createObjectURL(data);
      applyInfo.uploadFiles.push({
        url,
        serverId: item.fileId,
        message: "",
        status: "done",
        isImage: true,
      });
    });
  }
};

init();
</script>
