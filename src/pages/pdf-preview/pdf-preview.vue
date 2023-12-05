<template>
  <div class="preview-container">
    <van-nav-bar title="预览" left-arrow @click-left="handleGoback" />
    <vue-office-pdf style="height: 100vh;" :src="src"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { download, fetchSealImages, loadSealImage } from "./service";
import VueOfficePdf from '@vue-office/pdf';

/**
 * 下载资源
 */
 const downloadResource = async (fileId) => {
  const data = await download(fileId);
  return data;
};

const route = useRoute();
const router = useRouter();
const fileId = route.query.fileId;


const src = ref("");
onMounted(async () => {
  const blob = await downloadResource(fileId);
  console.log(blob);
  src.value = blob;
});

const handleGoback = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
  }
}
</style>
