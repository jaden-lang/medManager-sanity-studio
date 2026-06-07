import {defineField, defineType} from 'sanity'

// 單例：網站全域設定（網站名稱、聯絡資訊、社群連結、預設 SEO）。
// 由 structure 以固定 documentId 指向唯一一份，config 隱藏建立/複製/刪除。
export default defineType({
  name: 'siteSettings',
  title: '網站設定',
  type: 'document',
  groups: [
    {name: 'general', title: '基本資料'},
    {name: 'contact', title: '聯絡資訊'},
    {name: 'social', title: '社群連結'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: '網站名稱',
      type: 'localeString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: '網站 Logo',
      type: 'image',
      options: {hotspot: true},
      group: 'general',
    }),
    defineField({
      name: 'slogan',
      title: '標語',
      type: 'localeString',
      description: '顯示在 Logo 旁或頁尾的一句話',
      group: 'general',
    }),
    defineField({
      name: 'phone',
      title: '聯絡電話',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: '聯絡信箱',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email().error('請輸入有效的電子郵件'),
    }),
    defineField({
      name: 'address',
      title: '地址',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'businessHours',
      title: '營業時間',
      type: 'localeText',
      description: '例如：週一至週五 09:00–18:00',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: '社群連結',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: '平台',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LINE', value: 'line'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
            }),
            defineField({
              name: 'url',
              title: '網址',
              type: 'url',
            }),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: '預設 SEO',
      type: 'seo',
      description: '未自訂頁面 SEO 時的全站預設值',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: '網站設定'}
    },
  },
})
