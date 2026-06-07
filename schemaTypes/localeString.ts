import {defineField, defineType} from 'sanity'
import {supportedLanguages} from './supportedLanguages'

// 多語字串：預設語言攤在外面，其餘語言收進可摺疊的 translations fieldset。
export default defineType({
  name: 'localeString',
  title: '多語字串',
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
      type: 'string',
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
})
