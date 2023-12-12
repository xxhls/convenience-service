<template>
  <div>
    <region :region-name="linkRegionName"></region>
    <banner></banner>
    <div class="business-box">
      <div
        v-for="(item, index) in businessList"
        :key="index"
        class="business-list"
      >
        <div class="title">{{ item.categoryName }}</div>
        <div class="inner">
          <div
            v-for="bs in item.businessViews"
            :key="bs.id"
            class="business-item"
            @click="handleClick(bs)"
          >
            <business-icon :name="bs.iconId"></business-icon>
            <div class="business-name">{{ bs.businessName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <login
    :value="userStore.loginStatus"
    @login:register="openRegister"
    @update:value="handleShowChange"
    @login:success="handleLoginSucess"
  ></login>
  <register
    v-model:value="showRegister"
    @register:success="handleLoginSucess"
  ></register>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Region } from "@/components";
import { useUserInfoStore } from "@/store";
import { queryRegionNameById } from "@/services";
import { Banner, BusinessIcon, Login, Register } from "./components";
import { fetchBusiness } from "./services";
import { computed } from "vue";
import { showSuccessToast } from 'vant';

const router = useRouter();
const route = useRoute();
const userStore = useUserInfoStore();
const linkRegionName = computed(() => userStore.linkRegionName);

const getLinkRegion = async () => {
  const { regionId } = route.query;
  if (regionId) {
    const { code, data } = await queryRegionNameById(regionId);
    if (code === 0) {
      userStore.setLinkRegion({
        regionId,
        regionName: data,
      });
    }
  }
};

const businessList = ref([]);
const getBusiness = async () => {
  const { code, data } = await fetchBusiness();
  if (code === 0) {
    businessList.value = data;
  }
};

const handleClick = (bs) => {
  router.push({
    name: "apply",
    query: {
      businessId: bs.id,
      businessName: bs.businessName,
    },
  });
};

const handleShowChange = (show) => {
  userStore.toogleLoginStatus(show);
};

const showRegister = ref(false);
const openRegister = () => {
  showRegister.value = true;
};
const closeRegister = () => {
  showRegister.value = false;
};

const handleLoginSucess = (data) => {
  showSuccessToast("登录成功");
  userStore.setUserInfo(data);
  closeRegister();
  userStore.toogleLoginStatus(false);
};
onBeforeMount(() => {
  getBusiness();
  getLinkRegion();
});
</script>

<style lang="scss" scoped>
.business-box {
  padding: 20px 16px;
  .business-list {
    margin-bottom: 50px;
  }
  .title {
    padding: 0;
    height: 22px;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 22px;
  }
  .inner {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    .business-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .business-name {
      padding-top: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #000000;
      text-align: center;
    }
  }
}
</style>
