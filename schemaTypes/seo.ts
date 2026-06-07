import {defineField, defineType} from 'sanity'

// 可重用 SEO 物件：任何頁面/文件加一個 type: 'seo' 欄位即可共用。
export default defineType({
  name: 'seo',
  title: 'SEO 設定',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO 標題',
      type: 'localeString',
      description: '搜尋結果與瀏覽器分頁顯示的標題，建議 60 字以內',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO 描述',
      type: 'localeText',
      description: '搜尋結果摘要，建議 160 字以內',
    }),
    defineField({
      name: 'ogImage',
      title: '分享預覽圖',
      type: 'image',
      options: {hotspot: true},
      description: '分享到社群媒體時顯示的縮圖，建議 1200×630',
    }),
    defineField({
      name: 'keywords',
      title: '關鍵字',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'noIndex',
      title: '不被搜尋引擎收錄',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
