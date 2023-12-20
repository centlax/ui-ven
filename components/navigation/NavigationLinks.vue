<template>
  <div v-if="links?.length" :class="level > 0 ? ui.wrapperLevel : ui.wrapper" v-bind="attrs">
    <ULink
      v-for="(link, index) in links"
      :key="index"
      v-bind="omit(link, ['label', 'icon', 'iconClass', 'badge', 'children'])"
      :class="[ui.base, level > 0 && ui.level]"
      :active-class="ui.active"
      :inactive-class="ui.inactive"
      @click="link.click"
    >
      <UIcon v-if="link.icon" :name="link.icon" :class="[ui.icon.base, link.iconClass]" />

      <span :class="ui.label">{{ link.label }}</span>

      <slot name="badge">
        <UBadge v-if="link.badge" size="xs" variant="subtle" :ui="{ rounded: 'rounded-full' }">
          {{ link.badge }}
        </UBadge>
      </slot>
    </ULink>
  </div>
</template>

<script setup lang="ts">
import type { Link } from '#ui-pro/types'
import { omit } from '../../lib/lodash'

const config = {
  wrapper: 'space-y-3',
  wrapperLevel: 'space-y-1.5',
  base: 'flex items-center gap-1.5 group',
  active: 'text-primary font-medium border-current',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400',
  level: 'border-l -ml-px pl-4',
  icon: {
    base: 'w-5 h-5 flex-shrink-0'
  },
  label: 'text-sm/6 truncate'
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  level?: number
  links?: Link[]
  ui?: Partial<typeof config>
  class?: any
}>(), {
  level: 0,
  links: () => [],
  ui: () => ({}),
  class: undefined
})

const { ui, attrs } = useUI('navigation.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
