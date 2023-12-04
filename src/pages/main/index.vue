<template>
  <div class="frame">
    <van-nav-bar v-if="active === 'home'" title="便民用印服务平台" />
    <div class="frame-content">
      <router-view></router-view>
    </div>
    <van-tabbar v-model="active" :fixed="false" @change="handleChange">
      <van-tabbar-item name="home"
        >首页
        <template #icon="props">
          <img :src="props.active ? HomeChecked : HomeUnchecked" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="my">
        我的
        <template #icon="props">
          <img :src="props.active ? MyChecked : MyUnchecked" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { HomeChecked, HomeUnchecked, MyChecked, MyUnchecked } from "./assets";
import { watch } from "vue";

const active = ref("home");
const route = useRoute();
const router = useRouter();
watch(
  () => route.name,
  (value) => {
    active.value = value;
  },
  {
    immediate: true,
  }
);

const handleChange = (value) => {
  router.push({
    name: value,
  });
};
</script>

<style lang="scss" scoped>
.frame {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .frame-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
