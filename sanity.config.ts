import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {zhHantLocale} from '@sanity/locale-zh-hant' // 官方繁中介面語言包
import {schemaTypes} from './schemaTypes'
import {structure, singletonTypes} from './structure'
import {StudioNavbar} from './components/StudioNavbar'
import {medZhHantBundle, medEnBundle} from './i18n'

export default defineConfig({
  name: 'default',
  title: 'medManager',

  projectId: 'qrepjm4m',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), zhHantLocale()],

  // 掛上自訂介面語言包
  i18n: {
    bundles: [medZhHantBundle, medEnBundle],
  },

  // 用自訂導覽列（內含介面語言切換器）
  studio: {
    components: {navbar: StudioNavbar},
  },

  schema: {
    types: schemaTypes,
    // 單例不顯示在「建立新文件」清單中
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // 單例隱藏「複製」與「刪除」動作
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : input,
  },
})
