<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <p :class="ui.status">
      {{ error?.statusCode || status }}
    </p>
    <h1 :class="ui.name">
      {{ error?.name || error?.statusMessage || name }}
    </h1>
    <p :class="ui.message">
      {{ error?.message && error.message !== (error.name || error.statusMessage || name) ? error.message : message }}
    </p>
    <div :class="ui.links">
      <UButton v-bind="{ ...ui.default.clearButton, ...clearButton }" @click="handleError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import type { Button } from '#ui/types'

const config = {
  wrapper: 'min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center',
  status: 'text-base font-semibold text-primary',
  name: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl',
  message: 'mt-6 text-base/7 text-gray-500 dark:text-gray-400 text-center',
  links: 'mt-10 flex items-center justify-center gap-x-6',
  default: {
    clearButton: {
      label: 'Go back home',
      color: 'primary' as const,
      size: 'lg' as const
    }
  }
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  error?: Partial<NuxtError>
  status?: number
  name?: string
  message?: string
  clearButton?: Button
  ui?: Partial<typeof config>
  class?: any
}>(), {
  error: undefined,
  status: 404,
  name: 'An error occurred',
  message: 'This is not the page you\'re looking for.',
  clearButton: () => ({}),
  ui: () => ({}),
  class: undefined
})

const { ui, attrs } = useUI('page.error', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const handleError = () => clearError({ redirect: '/' })
</script>
