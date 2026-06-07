import {defineField, defineType} from 'sanity'
import {supportedLanguages} from './supportedLanguages'

// 多語內文（Portable Text）：與 localeString 同結構，內層改用 blockContent。
export default defineType({
  name: 'localeBlockContent',
  title: '多語內文',
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
      type: 'blockContent',
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
})
