import {defineField, defineType} from 'sanity'

// 內容清單：最新消息（會有很多筆，非單例）。
export default defineType({
  name: 'news',
  title: '最新消息',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '標題',
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
      name: 'category',
      title: '分類',
      type: 'string',
      options: {
        list: [
          {title: '公告', value: 'announcement'},
          {title: '活動', value: 'event'},
          {title: '媒體報導', value: 'press'},
        ],
        layout: 'radio',
      },
      initialValue: 'announcement',
    }),
    defineField({
      name: 'publishedAt',
      title: '發布日期',
      type: 'datetime',
      options: {dateFormat: 'YYYY-MM-DD'},
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: '封面圖片',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      description: '列表頁顯示的簡短描述，建議 100 字以內',
      type: 'localeText',
    }),
    defineField({
      name: 'body',
      title: '內文',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'isPinned',
      title: '置頂',
      description: '開啟後會固定排在列表最前面',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO 設定',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: '發布日期（新→舊）',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title.zhTW', subtitle: 'publishedAt', media: 'coverImage'},
    prepare({title, subtitle, media}) {
      return {
        title,
        // 把 datetime 字串格式化成日期，未填則提示
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('zh-TW') : '未排定發布日',
        media,
      }
    },
  },
})
