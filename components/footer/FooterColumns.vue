<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="$slots.left" :class="ui.left">
      <slot name="left" />
    </div>

    <div :class="ui.center">
      <div v-for="(link, index) in links" :key="index">
        <h3 :class="ui.label">
          {{ link.label }}
        </h3>

        <ul role="list" :class="ui.list">
          <li v-for="(subLink, subIndex) of link.children" :key="subIndex">
            <ULink
              v-bind="omit(subLink, ['label', 'icon'])"
              :class="ui.base"
              :active-class="ui.active"
              :inactive-class="ui.inactive"
              @click="subLink.click"
            >
              {{ subLink.label }}

              <UIcon v-if="subLink.target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />
            </ULink>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="$slots.right" :class="ui.right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Link } from '#ui-pro/types'
import { omit } from '../../lib/lodash'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'xl:grid xl:grid-cols-3 xl:gap-8',
  left: 'mb-10 xl:mb-0',
  center: 'flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2',
  right: 'mt-10 xl:mt-0',
  label: 'text-sm/6 font-semibold text-gray-900 dark:text-white',
  list: 'mt-6 space-y-4',
  base: 'text-sm relative',
  active: 'text-gray-900 dark:text-white font-medium',
  inactive: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500'
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  links?: Link[]
  ui?: Partial<typeof config.value>
  class?: any
}>(), {
  links: () => [],
  ui: () => ({}),
  class: undefined
})

const { ui, attrs } = useUI('footer.columns', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
