<template>
  <div class="step-bar_box">
    <div class="value-container">
      <div
        v-for="step in steps"
        :key="step.value"
        class="step-item"
        :class="{ active: step.value <= props.currentStep }"
      >
        <div class="line before" :style="beforeStyle(step.value)"></div>
        <div class="num">
          {{ step.value }}
        </div>
        <div
          class="line"
          :class="{ active: step.value < props.currentStep }"
          :style="afterStyle(step.value)"
        ></div>
      </div>
    </div>
    <div class="label-container">
      <div
        v-for="step in steps"
        :key="step.value"
        class="label-item"
        :class="{ active: step.value <= props.currentStep }"
      >
        {{ step.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
    default: 1,
  },
});

const steps = [
  { value: 1, label: "办理须知" },
  { value: 2, label: "完善基本信息" },
  { value: 3, label: "上传盖章文件" },
  { value: 4, label: "确认盖章文件" },
  { value: 5, label: "完成" },
];

const beforeStyle = computed(() => {
  return (value) => {
    return {
      visibility: value === 1 ? "hidden" : "visible",
    };
  };
});

const afterStyle = computed(() => {
  return (value) => {
    return {
      visibility: value === 5 ? "hidden" : "visible",
    };
  };
});
</script>

<style lang="scss" scoped>
.step-bar_box {
  margin-top: 20px;
  font-size: 13px;
}
.value-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  .step-item {
    display: flex;
    align-items: center;
    &.active {
      .num {
        color: red;
        border-color: #CC1D1D;
      }
      .before {
        background-color: #CC1D1D;
      }
    }
    .num {
      border-radius: 50px;
      padding: 2px 15px;
      border: 1px solid #D1D1D1;
      font-weight: bold;
      color: #D1D1D1;
    }
    .before {
      color: #D1D1D1;
    }
    .line {
      flex: 1;
      height: 2px;
      background-color: #D1D1D1;
      &.active {
        background-color: #CC1D1D;
      }
    }
  }
}
.label-container {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  .label-item {
    text-align: center;
    &.active {
      color: #CC1D1D;
    }
  }
}
</style>
