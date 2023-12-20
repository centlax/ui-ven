import { createResolver, defineNuxtModule, addImportsDir, hasNuxtModule, addComponentsDir } from '@nuxt/kit'
import { ofetch } from 'ofetch'
import { join } from 'pathe'
import { readFile } from 'node:fs/promises'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { defu } from 'defu'

import pkg from '../../package.json'

export interface ModuleOptions {
  license?: string
}

export default defineNuxtModule({
  meta: {
    name: 'ui-pro',
    configKey: 'uiPro'
  },
  defaults: {
    license: ''
  },
  setup (_, nuxt) {
    const resolver = createResolver(import.meta.url)
    /**
     * Add Content components & utils only if Nuxt Content is present
     */
    if (hasNuxtModule('@nuxt/content')) {
      // Add auto-imported utils
      addImportsDir(resolver.resolve('runtime/utils'))

      addComponentsDir({
        path: resolver.resolve('runtime/components/content'),
        global: true,
        prefix: '',
        pathPrefix: false
      })

      addComponentsDir({
        path: resolver.resolve('runtime/components/docs'),
        prefix: 'U',
        pathPrefix: false
      })

      // @ts-ignore
      nuxt.options.content = defu(nuxt.options.content, {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          },
          preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
        },
        navigation: {
          fields: ['icon', 'to', 'target']
        }
      })

      // @ts-ignore
      nuxt.hook('tailwindcss:config', function (tailwindConfig) {
        // @ts-ignore
        tailwindConfig.content.files.push(resolver.resolve('./runtime/components/**/*.{vue,mjs,ts}'))
      })
    }
    /**
     * License
     */
    const { env, link } = pkg.theme || {}
    // @ts-ignore
    const key = process.env[env] || nuxt.options.uiPro?.license

    if (nuxt.options.dev || nuxt.options._prepare) {
      if (nuxt.options.dev && !key) {
        consola.box(
          colors.greenBright('Nuxt UI Pro') + '\n\n' +
          `Missing \`${env}\` env variable, please add it to your \`.env\`.` + '\n\n' +
          colors.blueBright(`Purchase Nuxt UI Pro at ${link} to build your app in production.`)
        )
      }
      return
    }

    nuxt.hook('build:before', async () => {
      if (!key) {
        throw new Error(`You must provide the \`${env}\` environment variable.\n Purchase Nuxt UI Pro at \`${link}\` to build your app for production.`)
      }

      const projectPkg = await readFile(join(nuxt.options.rootDir, 'package.json'))
        .then((pkg) => JSON.parse(pkg.toString()))
        .catch(() => null)

      if (!projectPkg?.name) {
        throw new Error('You must provide a `name` in your `package.json` to activate Nuxt UI Pro.')
      }

      try {
        await ofetch('https://api.nuxtlabs.com/ui-pro/verify', {
          headers: {
            Authorization: `key ${key}`,
            'x-nuxt-project': projectPkg.name
          }
        })
      } catch (e) {
        throw new Error(`Invalid \`${env}\` license key.\nPurchase Nuxt UI Pro at \`${link}\` to build your app in production.`)
      }
    })
  }
})
