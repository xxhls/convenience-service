<template>
  <div class="my-box">
    <div class="user-info">
      <van-image round width="44px" height="44px" :src="DefaultIcon" />
      <div class="right">
        <div class="name">{{ userName }}</div>
        <div class="phone">
          <span>{{ phone }}</span>
          <van-image width="14px" :src="EditIcon" class="edit-img" />
          <span class="edit-text" @click="handleEdit">修改</span>
        </div>
      </div>
    </div>
    <div class="my-business">我的办理</div>
    <div class="num-list">
      <van-cell
        is-link
        v-for="item in nums"
        :title="item.label"
        class="num-item"
        @click="handleGotoList(item)"
      >
        <template #icon>
          <van-image :src="item.icon" width="24px"></van-image>
        </template>
        <template #value>
          <div class="value-box">{{ item.value }}</div>
        </template>
      </van-cell>
    </div>
    <div class="footer">
      <van-button type="primary" round block @click="deleteLogin">
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
:deep(.van-cell) {
  background-color: initial;
}
.my-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("./images/bg.png");
}
.user-info {
  display: flex;
  align-items: center;
  padding: 10px 0 20px 16px;
  
  // background-repeat: no-repeat;
  // background-position: 0, 0;
  .right {
    .name {
      margin-bottom: 2px;
      height: 22px;
      font-size: 16px;
      font-weight: bold;
      color: #000000;
      line-height: 22px;
    }
    .phone {
      display: flex;
      align-items: center;

      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;


      .edit-img {
        margin-left: 8px;
        margin-right: 5px;
      }
      .edit-text {
        font-size: 14px;
        font-weight: 400;
        color: #cc1d1d;
      }
    }
    padding-left: 15px;
  }
}
.my-business {
  padding: 30px 16px 0;
  padding-bottom: 0;
  height: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  line-height: 22px;

}
.num-list {
  // padding: 20px 20px;
  .num-item {
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    :deep(.van-cell__title) {
      margin-left: 12px;

      height: 24px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;

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
