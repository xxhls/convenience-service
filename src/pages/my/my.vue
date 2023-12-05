<template>
  <div class="my-box">
    <div class="user-info">
      <van-image round width="80px" height="80px" :src="DefaultIcon" />
      <div class="right">
        <div class="name">{{ userName }}</div>
        <div class="phone">
          <span>{{ phone }}</span>
          <van-image width="19px" :src="EditIcon" class="edit-img" />
          <span class="edit-text" @click="handleEdit">修改</span>
        </div>
      </div>
    </div>
    <Region :region-name="regionName"></Region>
    <div class="num-list">
      <van-cell
        is-link
        v-for="item in nums"
        :title="item.label"
        class="num-item"
        @click="handleGotoList(item)"
      >
        <template #icon>
          <van-image :src="item.icon" width="40px"></van-image>
        </template>
        <template #value>
          <div class="value-box">{{ item.value }}</div>
        </template>
      </van-cell>
    </div>
    <div class="footer">
      <van-button type="danger" round block @click="deleteLogin">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { removeToken } from "@/utils/token";
import { useUserInfoStore } from "@/store";
import { Region } from "@/components";
import {
  DefaultIcon,
  EditIcon,
  iconDoing,
  iconTodo,
  iconReject,
  iconDone,
} from "./images";
import { fetchTaskNums } from "./services";
import { showSuccessToast } from 'vant';
const router = useRouter();
const store = useUserInfoStore();
const userName = computed(() => store.userName);
const phone = computed(() => store.userPhone);
const regionName = computed(() => store.userRegionName);

const nums = reactive([
  {
    status: 0,
    value: 0,
    label: "受理中",
    icon: iconDoing,
  },
  {
    status: 1,
    value: 0,
    label: "待盖章",
    icon: iconTodo,
  },
  {
    status: 2,
    value: 0,
    label: "已驳回",
    icon: iconReject,
  },
  {
    status: 3,
    value: 0,
    label: "已办结",
    icon: iconDone,
  },
]);

const handleEdit = () => {
  router.push({
    name: "update",
  });
};

const getTasks = async () => {
  const { code, data } = await fetchTaskNums(store.userId);
  if (code === 0) {
    data.map((item) => {
      const target = nums.find((t) => t.status === item.applyStatus);
      if (target) {
        target.value = item.applyCount;
      }
    });
  }
};

const handleGotoList = (item) => {
  router.push({
    name: "taskList",
    query: {
      label: item.label,
      status: item.status,
    },
  });
};

const deleteLogin = () => {
  removeToken();
  router.push({
    name: "home",
    query: {
      regionId: store.linkRegionId,
    },
  });
  store.resetUserInfo();
  showSuccessToast("退出成功");
};

getTasks();
</script>

<style lang="scss" scoped>
.my-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  .right {
    .name {
      font-size: 19px;
      color: #000000;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .phone {
      display: flex;
      align-items: center;
      font-size: 17px;
      font-weight: 400;
      .edit-img {
        margin-left: 15px;
        margin-right: 5px;
      }
      .edit-text {
        font-size: 17px;
        font-weight: 400;
        color: #cc1d1d;
      }
    }
    padding-left: 15px;
  }
}
.num-list {
  padding: 20px 20px;
  .num-item {
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    :deep(.van-cell__title) {
      font-size: 17px;
      font-weight: 400;
      color: #000;
      margin-left: 12px;
    }
    .value-box {
      display: inline-flex;
      width: 30px;
      height: 20px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #cc1d1d;
      border: 1px solid #cd1414;
      border-radius: 13px;
      margin-right: 11px;
    }
  }
}
.footer {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}
</style>
