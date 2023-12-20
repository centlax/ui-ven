<template>
  <nav v-if="groups?.length" :class="ui.wrapper" v-bind="attrs">
    <template v-for="(group, index) in groups" :key="index">
      <UNavigationAccordion
        v-if="group.type === 'accordion'"
        :links="group.children"
        :level="level"
        :multiple="multiple"
        :default-open="defaultOpen"
      />
      <UNavigationLinks v-else :links="group.children" :level="level" />
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { Link } from '#ui-pro/types'

const config = {
  wrapper: 'space-y-3'
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  level?: number
  links?: Link[]
  multiple?: boolean
  defaultOpen?: boolean
  ui?: Partial<typeof config>
  class?: any
}>(), {
  level: 0,
  links: () => [],
  multiple: true,
  defaultOpen: undefined,
  ui: () => ({}),
  class: undefined
})

type LinkGroup = {
  type?: 'link' | 'accordion'
  defaultOpen?: boolean
  children: Link[]
}

const { ui, attrs } = useUI('navigation.tree', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const groups = computed<LinkGroup[]>(() => {
  const groups: LinkGroup[] = []

  let group: LinkGroup = { type: undefined, children: [] }

  for (const link of props.links) {
    const type = link.children?.length ? 'accordion' : 'link'
    if (!group.type) {
      group.type = type
    }

    if (group.type === type) {
      group.children.push(link)
    } else {
      groups.push(group)
      group = { type, children: [link] }
    }
  }

  if (group.children.length) {
    groups.push(group)
  }

  return groups
})
</script>
