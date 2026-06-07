import {defineField, defineType} from 'sanity'
import {supportedLanguages} from './supportedLanguages'

// 多語長文字：與 localeString 同結構，內層改用多行 text。
export default defineType({
  name: 'localeText',
  title: '多語長文字',
  type: 'object',
  fieldsets: [
    {
      name: 'translations',
      title: '翻譯（其他語言）',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: supportedLanguages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'text',
      rows: 3,
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
})
