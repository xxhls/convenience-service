<template>
  <div class="preview-container">
    <van-nav-bar title="预览" left-arrow @click-left="handleGoback" />
    <iframe
      class="content"
      frameborder="0"
      type="application/x-google-chrome-pdf"
      :src="url"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const url = route.query.pdfUrl;

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
