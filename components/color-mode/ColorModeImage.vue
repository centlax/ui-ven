<template>
  <component :is="as" :src="light" class="dark:hidden" v-bind="$attrs" />
  <component :is="as" :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

withDefaults(defineProps<{
  as?: string | object
  dark: string
  light: string
}>(), {
  as: 'img'
})
</script>
