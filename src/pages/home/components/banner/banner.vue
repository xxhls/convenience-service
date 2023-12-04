<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in imageList" :key="index">
      <img :src="item" class="swipe-img" />
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
import { ref } from "vue";
import { fetchBanners, loadBannerImage } from "./services";

const imageList = ref([]);
const getBanners = async () => {
  const { code, data } = await fetchBanners();
  if (code === 0) {
    data.map(async (item) => {
      const res = await loadBannerImage(item);
      const imgUrl = window.URL.createObjectURL(res);
      imageList.value.push(imgUrl);
    });
  }
};
getBanners();
</script>

<style lang="scss" scoped>
.my-swipe {
  margin: 20px;
  .van-swipe-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
  }
  .swipe-img {
    max-width: 100%;
  }
}
</style>
