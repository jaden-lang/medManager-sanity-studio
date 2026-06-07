import {defineField, defineType} from 'sanity'

// 內容清單：方案（會有很多筆，非單例）。
export default defineType({
  name: 'plan',
  title: '方案',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '方案名稱',
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
      name: 'price',
      title: '價格',
      type: 'string',
      description: '可填數字或文字，例如「3,000」或「電洽」',
    }),
    defineField({
      name: 'priceUnit',
      title: '計價單位',
      type: 'localeString',
      description: '例如：/ 月、/ 次',
    }),
    defineField({
      name: 'summary',
      title: '方案簡介',
      type: 'localeText',
    }),
    defineField({
      name: 'features',
      title: '方案內容',
      type: 'array',
      description: '條列方案包含的項目',
      of: [{type: 'localeString'}],
    }),
    defineField({
      name: 'ctaText',
      title: '按鈕文字',
      type: 'localeString',
      description: '價格卡底部按鈕文字，例如「立即註冊」',
    }),
    defineField({
      name: 'ctaUrl',
      title: '按鈕連結',
      type: 'string',
      description: '例如：/register 或完整網址',
    }),
    defineField({
      name: 'isFeatured',
      title: '主打方案',
      description: '開啟後會以醒目樣式呈現',
      type: 'boolean',
      initialValue: false,
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
  preview: {
    select: {title: 'title.zhTW', price: 'price', featured: 'isFeatured'},
    prepare({title, price, featured}) {
      return {
        title,
        subtitle: [featured ? '★ 主打' : null, price].filter(Boolean).join('  '),
      }
    },
  },
})
