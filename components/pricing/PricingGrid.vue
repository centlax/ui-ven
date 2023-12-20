<template>
  <div :class="[ui.wrapper, compact && 'gap-x-0']" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  compact?: boolean,
  ui?: Partial<typeof config>,
  class?: any
}>()

const config = {
  wrapper: 'flex flex-col lg:grid lg:grid-cols-3 w-full justify-center items-center gap-8'
}

const { ui, attrs } = useUI('pricing.grid', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
