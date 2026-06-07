import {defineField, defineType} from 'sanity'

// 內容清單：服務項目（會有很多筆，非單例）。
export default defineType({
  name: 'service',
  title: '服務項目',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '服務名稱',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '網址代稱',
      type: 'slug',
      options: {source: 'title.zhTW', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: '服務圖片',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'summary',
      title: '服務簡介',
      description: '列表頁顯示的簡短描述，建議 100 字以內',
      type: 'localeText',
    }),
    defineField({
      name: 'description',
      title: '詳細說明',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'order',
      title: '排列順序',
      type: 'number',
      description: '數字越小越前面',
    }),
    defineField({
      name: 'seo',
      title: 'SEO 設定',
      type: 'seo',
    }),
  ],
  orderings: [
    {title: '排列順序', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title.zhTW', subtitle: 'summary.zhTW', media: 'image'}},
})
