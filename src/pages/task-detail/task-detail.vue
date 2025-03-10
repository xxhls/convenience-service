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

      <div style="padding-top: 5px;" class="info-item van-hairline--bottom">
        <span class="label">姓名：</span>
        <span>{{ detail.applyUserName }}</span>
      </div>
      <div class="info-item van-hairline--bottom">
        <span class="label">手机号：</span>
        <span>{{ detail.applyUserPhone }}</span>
      </div>
      <div class="info-item van-hairline--bottom">
        <span class="label">所属区域：</span>
        <span>{{ detail.regionName }}</span>
      </div>
      <div class="py-20 van-hairline--bottom">
        <div>盖章材料：</div>
        <div v-for="(item, index) in detail.applyFileViews" class="file-item">
          <span class="file-name">{{ item.fileName }}</span>
          <van-space :size="15" class="op-box">
            <span class="op" @click="handleReview(item, index, 'preview')"
              >预览</span
            >
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

      <div v-if="detail.applyStatus === 3" class="py-20">
        <div class="mb-20">盖章图片：</div>
        <div v-if="sealImages?.length > 0" class="seal-images">
          <img
            v-for="(img, index) in sealImages"
            :key="index"
            :src="img.small"
            @click="handlePreview(img, index, 'seal')"
          />
        </div>
        <van-empty v-else description="暂无盖章图片" />
      </div>
    </div>
    <div class="footer" v-if="detail.applyStatus === 2">
      <van-button type="primary" round block @click="handleReEdit"
        >重新编辑</van-button
      >
    </div>
    <van-image-preview
      v-model:show="show"
      :images="images"
      :startPosition="currentIndex"
      @change="onChange"
    >
      <template v-slot:index>第{{ currentIndex + 1 }}页</template>
    </van-image-preview>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import fileDownload from "js-file-download";
import { isImage } from "@/utils";
import { fetchDetail } from "@/services";
import { FinishIcon, IngIcon, RejectIcon, PaddingSealIcon } from "./images";
import { download, fetchSealImages, loadSealImage } from "./service";

const router = useRouter();
const route = useRoute();
const statusIcon = {
  0: IngIcon,
  1: PaddingSealIcon,
  2: RejectIcon,
  3: FinishIcon,
};
const detail = ref({});
const applyImagesList = ref([]);
const applyImagesListIndex = ref([]);
const getDetail = async () => {
  const { code, data } = await fetchDetail(route.query.id);
  if (code === 0) {
    detail.value = data;
    if (data.applyStatus === 3) {
      getSealImages(data.applyId);
    }
  }
};

const images = ref([]);

/**
 * 获取盖章文件
 */
const sealImages = ref([]); // 盖章文件
const getSealImages = async (applyId) => {
  const { code, data } = await fetchSealImages(applyId);
  if (code === 0) {
    data.map(async (item) => {
      const blob = await loadSealImage(item.smallUrl);
      const url = window.URL.createObjectURL(blob);
      sealImages.value.push({
        small: url,
        big: "",
        bigId: item.bigUrl,
      });
    });
  }
};
const previewImages = ref([]);
const handlePreview = async (img, index) => {
  currentIndex.value = index;
  if (previewImages.value.length === 0) {
    let loaded = 0;
    const total = sealImages.value.length;
    sealImages.value.map(async (file) => {
      const bigBlob = await loadSealImage(file.bigId);
      const bigUrl = window.URL.createObjectURL(bigBlob);
      previewImages.value.push(bigUrl);
    });
    loaded = loaded + 1;
    if (loaded === total) {
      images.value = previewImages.value;
      show.value = true;
    }
  } else {
    images.value = previewImages.value;
    show.value = true;
  }
};

/**
 * 下载资源
 */
const downloadResource = async (fileId) => {
  const data = await download(fileId);
  return data;
};

const show = ref(false);
const currentIndex = ref(0);
const onChange = (newIndex) => {
  currentIndex.value = newIndex;
};
const handleReview = async (file, index, tag) => {
  // const blob = await downloadResource(file.fileId);
  const name = file.fileName;
  const type = name.substring(name.lastIndexOf(".") + 1);
  if (isImage(type)) {
    currentIndex.value = index;
    if (applyImagesList.value.length === 0) {
      let loaded = 0;
      const total = detail.value.applyFileViews.length;
      detail.value.applyFileViews.map(async (file, index) => {
        const name = file.fileName;
        const type = name.substring(name.lastIndexOf(".") + 1);
        if (isImage(type)) {
          applyImagesListIndex.value.push(index);
          const blob = await downloadResource(file.fileId);
          const url = window.URL.createObjectURL(blob);
          applyImagesList.value.push(url);
        }
        loaded = loaded + 1;
        if (loaded === total) {
          images.value = applyImagesList.value;
          show.value = true;
        }
      });
    } else {
      images.value = applyImagesList.value;
      show.value = true;
    }
  } else {
    router.push({
      name: "pdfPreviewer",
      query: {
        fileId: file.fileId,
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
    padding: 20px 16px;
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
      border-bottom: 1px solid #F5F5F5;
      .label {
        // width: 120px;
        flex-shrink: 0;
      }
    }

    .file-item {
      padding: 10px 0 20px;
      display: flex;
      align-items: center;
      // border-bottom: 1px solid #F5F5F5;
      .file-name {
        flex: 1;
        word-break: break-all;
        padding-right: 20px;
      }
      .op-box {
        flex-shrink: 0;
      }
      .op {
        color: rgba(204, 29, 29, 1);
        font-weight: 400;
        font-size: 16px;
      }
    }
    .reject-reson {
      margin-top: 10px;
      height: 160px;
      overflow-y: scroll;
      border-radius: 6px;
      padding: 10px;
    }
  }
  .footer {
    padding: 20px;
  }
}
.mb-20 {
  margin-bottom: 20px;
}
.seal-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  img {
    max-width: 100%;
  }
}
</style>

<style lang="scss">
// .van-image-preview__swipe {
//   &>div {
//     width: 1125px !important;;
//     &>div {
//       width: 100vw !important;;
//     }
//   }
// }
</style>
