<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="(icon || $slots.icon) || (title || $slots.title) || (description || $slots.description)" :class="ui.base">
      <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
        <slot name="icon">
          <UIcon :name="(icon as string)" :class="ui.icon.base" />
        </slot>
      </div>

      <p v-if="title || $slots.title" :class="ui.title">
        <slot name="title">
          {{ title }}
        </slot>
      </p>

      <p v-if="description || $slots.description" :class="ui.description">
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div :class="[ui.container, align === 'top' && 'flex-col-reverse']">
      <template v-if="providers?.length">
        <div :class="ui.providers">
          <UButton v-for="(provider, index) in providers" :key="index" v-bind="provider" block @click="provider.click" />
        </div>

        <UDivider :label="divider" />
      </template>

      <UForm
        :state="state"
        :schema="schema"
        :validate="validate"
        :validate-on="validateOn"
        :class="ui.form"
        @submit="$emit('submit', $event.data)"
      >
        <UFormGroup
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :description="field.description"
          :help="field.help"
          :hint="field.hint"
          :name="field.name"
          :size="field.size"
        >
          <UInput v-model="state[field.name]" v-bind="omit(field, ['label', 'description', 'help', 'hint', 'size'])" />

          <template v-if="$slots[`${field.name}-label`]" #label>
            <slot :name="`${field.name}-label`" />
          </template>
          <template v-if="$slots[`${field.name}-description`]" #description>
            <slot :name="`${field.name}-description`" />
          </template>
          <template v-if="$slots[`${field.name}-hint`]" #hint>
            <slot :name="`${field.name}-hint`" />
          </template>
          <template v-if="$slots[`${field.name}-help`]" #help>
            <slot :name="`${field.name}-help`" />
          </template>
        </UFormGroup>

        <UButton type="submit" block v-bind="{ ...ui.default.submitButton, ...submitButton }" />
      </UForm>
    </div>

    <p v-if="$slots.footer" :class="ui.footer">
      <slot name="footer" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { omit } from '../../lib/lodash'
import type { Button, FormError, FormEventType, FormGroupSize } from '#ui/types'

const config = {
  wrapper: 'w-full max-w-sm space-y-6',
  base: '',
  container: 'gap-y-6 flex flex-col',
  title: 'text-2xl text-gray-900 dark:text-white font-bold',
  description: 'text-gray-500 dark:text-gray-400 mt-1',
  icon: {
    wrapper: 'mb-2 pointer-events-none',
    base: 'w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white'
  },
  providers: 'space-y-3',
  form: 'space-y-6',
  footer: 'text-sm text-gray-500 dark:text-gray-400 mt-2',
  default: {
    submitButton: {
      label: 'Continue'
    }
  }
}

defineOptions({
  inheritAttrs: false
})

type Field = {
  name: string
  type: string
  label: string
  description?: string
  help?: string
  hint?: string
  size?: FormGroupSize
  placeholder?: string
  required?: boolean
}

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  align?: 'top' | 'bottom'
  fields: Field[]
  providers?: (Button & { click?: Function })[]
  submitButton?: Button
  schema?: any
  validate?: ((state: any) => Promise<FormError[]>) | ((state: any) => FormError[])
  validateOn?: FormEventType[]
  divider?: string
  ui?: Partial<typeof config>
  class?: any
}>(), {
  title: undefined,
  description: undefined,
  icon: undefined,
  align: 'bottom',
  fields: () => [],
  providers: () => [],
  submitButton: () => ({}),
  schema: undefined,
  validate: undefined,
  validateOn: () => ['submit'],
  divider: 'or',
  ui: () => ({}),
  class: undefined
})

defineEmits(['submit'])

const { ui, attrs } = useUI('auth.form', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const state = reactive(Object.values(props.fields).reduce((acc, { name }) => {
  acc[name] = undefined
  return acc
}, {} as Record<string, any>))
</script>
