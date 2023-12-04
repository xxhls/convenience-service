<template>
  <div class="task-box">
    <van-nav-bar :title="label" left-arrow @click-left="handleGoback" />
    <div class="list-main">
      <van-empty
        v-if="taskList.length === 0"
        :description="`暂无${label}数据`"
      />
      <div v-else>
        <div
          v-for="item in taskList"
          :key="item.id"
          class="task-item"
          @click="handleViewDetail(item)"
        >
          <div class="task-no mb-20">
            <van-image :src="TaskNoIcon"></van-image>
            <span class="content">{{ item.applyNumber }}</span>
          </div>
          <div class="task-type mb-20">
            <span>业务类型：</span>
            <span>{{ item.businessName }}</span>
          </div>
          <div class="task-time mb-40">
            <span>申请时间：</span>
            <span>{{ item.applyDate }}</span>
          </div>
          <div class="van-hairline--bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserInfoStore } from "@/store";
import { fetchTaskList } from "./services";
import TaskNoIcon from "./images/task-no.png";

const router = useRouter();
const route = useRoute();
const store = useUserInfoStore();
const { label, status } = route.query;

const taskList = ref([]);
const getTaskList = async () => {
  const { code, data } = await fetchTaskList(store.userId, status);
  if (code === 0) {
    taskList.value = data;
  }
};

const handleViewDetail = (task) => {
  router.push({
    name: "taskDetail",
    query: {
      id: task.id,
    },
  });
};

const handleGoback = () => {
  router.go(-1);
};
getTaskList();
</script>

<style lang="scss" scoped>
.mb-20 {
  margin-bottom: 10px;
}
.mb-40 {
  margin-bottom: 40px;
}
.task-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .list-main {
    flex: 1;
    overflow-y: auto;
    .task-item {
      padding: 20px;
      .task-no {
        display: flex;
        align-items: center;
        .content {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
