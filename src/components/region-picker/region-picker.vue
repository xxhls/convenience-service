<template>
  <van-popup :show="props.value" round position="bottom">
    <van-cascader
      v-model="checked"
      title="请选择所属区域"
      :options="options"
      @finish="handleFinish"
      @change="handleChange"
      @close="handleClose"
    />
  </van-popup>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from "vue";
import { queryRegionTree } from "./services";
const ROOT_ID = 0;

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:value", "change"]);

watch(
  () => props.value,
  (value) => {
    if (value) {
      firstLoad();
    }
  }
);

const isLeaf = (type) => {
  return type === "4";
};

const checked = ref("");
const options = ref([]);

const firstLoad = async () => {
  options.value = await fetchRegions(ROOT_ID);
};
/**
 * 获取数据
 * @param {*} parentId
 */
const fetchRegions = async (parentId) => {
  const { code, data } = await queryRegionTree(parentId);
  if (code === 0) {
    return data?.map((item) => {
      const op = {
        value: item.id,
        text: item.regionName,
        isLeaf: isLeaf(item.regionType),
      };
      if (!op.isLeaf) {
        op.children = [];
      }
      return op;
    });
  }
  return [];
};

const handleChange = async ({ value, selectedOptions, tabIndex }) => {
  const cur = selectedOptions[tabIndex];
  if (cur.children?.length === 0) {
    const children = await fetchRegions(value);
    cur.children.push(...children);
  }
};
const handleFinish = ({ value, selectedOptions }) => {
  const regionName = selectedOptions?.map((item) => item.text).join("/");
  emit("change", {
    regionName,
    regionId: value,
  });
  handleClose();
};

const handleClose = () => {
  checked.value = "";
  emit("update:value", false);
};
</script>
