<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <p v-if="title || $slots.title" :class="ui.title">
      <slot name="title">
        {{ title }}
      </slot>
    </p>

    <div :class="ui.container">
      <slot>
        <ULink
          v-for="(link, index) of links"
          :key="index"
          v-bind="omit(link, ['label', 'icon', 'iconClass', 'badge', 'children'])"
          :class="ui.base"
          :active-class="ui.active"
          :inactive-class="ui.inactive"
        >
          <UIcon v-if="link.icon" :name="link.icon" :class="ui.icon.base" />
          <UAvatar v-if="link.avatar" v-bind="{ size: ui.avatar.size, ...link.avatar }" :class="ui.avatar.base" />

          <span :class="ui.label">
            {{ link.label }}

            <UIcon v-if="link.target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />
          </span>
        </ULink>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Link } from '#ui-pro/types'
import { omit } from '../../lib/lodash'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'space-y-3',
  title: 'text-sm/6 font-semibold flex items-center gap-1.5',
  container: 'space-y-3 lg:space-y-1.5',
  base: 'flex items-center gap-1.5',
  active: 'text-primary',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
  icon: {
    base: 'w-5 h-5 flex-shrink-0'
  },
  avatar: {
    base: 'self-center',
    size: '2xs' as const
  },
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500'
  },
  label: 'text-sm/6 font-medium relative'
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  title?: string
  links?: Link[]
  ui?: Partial<typeof config.value>
  class?: any
}>()

const { ui, attrs } = useUI('page.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
