<template>
  <div class="detail-box">
    <van-nav-bar
      :title="detail.businessName"
      left-arrow
      @click-left="handleGoback"
    />
    <div class="content">
      <div class="base-info">
        <span class="font-weight">基本信息</span>
        <van-image :src="statusIcon[detail.applyStatus]"></van-image>
      </div>

      <div class="info-item van-hairline--bottom">
        <span>姓名：</span>
        <span>{{ detail.applyUserName }}</span>
      </div>
      <div class="info-item van-hairline--bottom">
        <span>手机号：</span>
        <span>{{ detail.applyUserPhone }}</span>
      </div>
      <div class="info-item van-hairline--bottom">
        <span>所属区域：</span>
        <span>{{ detail.regionName }}</span>
      </div>
      <div class="py-20 van-hairline--bottom">
        <div>盖章材料：</div>
        <div v-for="item in detail.applyFileViews" class="file-item">
          <span class="file-name">{{ item.fileName }}</span>
          <van-space :size="15">
            <span class="op" @click="handleReview(item)">预览</span>
            <span class="op" @click="handleDownload(item)">下载</span>
          </van-space>
        </div>
      </div>

      <div v-if="detail.applyStatus === 2" class="py-20">
        <div>驳回说明：</div>
        <div class="reject-reson van-hairline--surround">
          {{ detail.rejectionReason }}
        </div>
      </div>
    </div>
    <div class="footer">
      <van-button type="danger" round block @click="handleReEdit"
        >重新编辑</van-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import fileDownload from "js-file-download";
import { showImagePreview } from "vant";
import { isImage } from "@/utils";
import { fetchDetail } from "@/services";

import { FinishIcon, IngIcon, RejectIcon } from "./images";
import { download } from "./service";

const router = useRouter();
const route = useRoute();
const statusIcon = {
  0: IngIcon,
  1: IngIcon,
  2: RejectIcon,
  3: FinishIcon,
};
const detail = ref({});
const getDetail = async () => {
  const { code, data } = await fetchDetail(route.query.id);
  if (code === 0) {
    detail.value = data;
  }
};

/**
 * 下载资源
 */
const downloadResource = async (fileId) => {
  const data = await download(fileId);
  return data;
};

const handleReview = async (file) => {
  const blob = await downloadResource(file.fileId);
  const name = file.fileName;
  const type = name.substring(name.lastIndexOf(".") + 1);
  if (isImage(type)) {
    const url = window.URL.createObjectURL(blob);
    showImagePreview([url]);
  } else {
    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "application/pdf" })
    );

    router.push({
      name: "pdfPreviewer",
      query: {
        pdfUrl: url,
      },
    });
  }
};

const handleDownload = async (file) => {
  const arraybuffer = await downloadResource(file.fileId);
  fileDownload(arraybuffer, file.fileName);
};
/**
 * 重新编辑
 */
const handleReEdit = () => {
  router.push({
    name: "apply",
    query: {
      id: route.query.id,
    },
  });
};

const handleGoback = () => {
  router.go(-1);
};
getDetail();
</script>

<style lang="scss" scoped>
.detail-box {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .font-weight {
    font-weight: bold;
  }
  .content {
    padding: 30px 20px;
    flex: 1;
    .base-info {
      display: flex;
      justify-content: space-between;
    }
    .py-20 {
      padding: 20px 0;
    }
    .info-item {
      display: flex;
      padding: 20px 0;
      align-items: center;
    }

    .file-item {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .file-name {
        flex: 1;
      }
      .op {
        color: rgba(204, 29, 29, 1);
        font-weight: 400;
        font-size: 16px;
      }
    }
    .reject-reson {
      margin-top: 10px;
      border-radius: 5px;
      padding: 5px;
    }
  }
  .footer {
    padding: 20px;
  }
}
</style>
