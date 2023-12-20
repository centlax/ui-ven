<template>
  <main :class="ui.wrapper" v-bind="attrs">
    <slot />
  </main>
</template>

<script setup lang="ts">
const config = {
  wrapper: 'min-h-[calc(100vh-var(--header-height))]'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  ui?: Partial<typeof config>
  class?: any
}>()

const { ui, attrs } = useUI('main', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
