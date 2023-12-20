<template>
  <ul v-if="links?.length" :class="ui.wrapper" v-bind="attrs">
    <li v-for="link in links" :key="link.text" :class="[ui.wrapper, link.depth === 3 && ui.depth]">
      <a
        :href="`#${link.id}`"
        :class="[ui.base, activeHeadings.includes(link.id) ? ui.active : ui.inactive]"
        @click.prevent="scrollToHeading(link.id)"
      >
        {{ link.text }}
      </a>

      <UDocsTocLinks v-if="link.children" :links="link.children" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxt/content/dist/runtime/types'

const config = {
  wrapper: 'space-y-1',
  base: 'block text-sm/6 truncate',
  active: 'text-primary',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
  depth: 'ml-3'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  links: TocLink[]
  ui?: Partial<typeof config>
  class?: any
}>()

const emit = defineEmits(['move'])

const route = useRoute()
const router = useRouter()
const { activeHeadings, updateHeadings } = useScrollspy()
const { ui, attrs } = useUI('docs.toc.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)

watch(() => route.path, () => {
  setTimeout(() => {
    if (process.client) {
      updateHeadings([
        ...document.querySelectorAll('h2'),
        ...document.querySelectorAll('h3')
      ])
    }
  }, 300)
}, { immediate: true })

const scrollToHeading = (id: string) => {
  router.push(`#${id}`)
  emit('move', id)
}
</script>
