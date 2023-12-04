<template>
  <img :src="icon" />
</template>

<script setup>
import { computed, defineProps } from "vue";
import icons from "./icons";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const icon = computed(() => {
  return icons[props.name] ?? icons.icon101;
});
</script>
