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
    v-model:value="showLogin"
    @login:register="openRegister"
    @login:success="handleLoginSucess"
  ></login>
  <register
    v-model:value="showRegister"
    @register:success="handleLoginSucess"
  ></register>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Region } from "@/components";
import { useUserInfoStore } from "@/store";
import { queryRegionNameById } from "@/services";
import { Banner, BusinessIcon, Login, Register } from "./components";
import { fetchBusiness } from "./services";
import { watch } from "vue";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserInfoStore();
const linkRegionName = computed(() => userStore.linkRegionName);

watch(
  () => route.query,
  (value) => {
    if (value.toLogin) {
      openLogin();
    }
  }
);

const getLinkRegion = async () => {
  const { regionId } = route.query;
  if (regionId) {
    const { code, data } = await queryRegionNameById(regionId);
    if (code === 0) {
      userStore.setRegionTag("router");
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

let memory;
const handleClick = (bs) => {
  if (!memory) {
    memory = bs;
  }
  router.push({
    name: "apply",
    query: {
      businessId: bs.id,
      businessName: bs.businessName,
    },
  });
};

const showLogin = ref(false);
const openLogin = () => {
  showLogin.value = true;
};

const showRegister = ref(false);
const openRegister = () => {
  showRegister.value = true;
};

const handleLoginSucess = (data) => {
  userStore.setUserInfo(data);
  if (userStore.regionTag === "empty") {
    userStore.setRegionTag("user");
    userStore.setLinkRegion({
      regionId: data.regionId,
      regionName: data.fullName,
    });
  }
  memory && handleClick(memory);
};
getBusiness();
getLinkRegion();
</script>

<style lang="scss" scoped>
.business-box {
  padding: 20px;
  .business-list {
    margin-bottom: 50px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #000000;
  }
  .inner {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    .business-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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
