import {defineField, defineType} from 'sanity'

// 單例：首頁。欄位多，用 groups 切成分頁改善編輯體驗。
export default defineType({
  name: 'homePage',
  title: '首頁',
  type: 'document',
  groups: [
    {name: 'hero', title: '首屏 Hero'},
    {name: 'services', title: '服務介紹'},
    {name: 'plans', title: '方案介紹'},
    {name: 'news', title: '最新消息'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── 首屏 Hero ──
    defineField({
      name: 'heroTitle',
      title: '主視覺標題',
      type: 'localeString',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: '主視覺副標題',
      type: 'localeText',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: '主視覺圖片',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaText',
      title: '主視覺按鈕文字',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaLink',
      title: '主視覺按鈕連結',
      type: 'string',
      description: '例如：/contact 或完整網址',
      group: 'hero',
    }),
    defineField({
      name: 'highlights',
      title: '數據亮點',
      type: 'array',
      description: '首屏下方的重點數據，例如「服務人次 10,000+」，建議 2–4 項',
      group: 'hero',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'value', title: '數值', type: 'string'}),
            defineField({name: 'label', title: '說明', type: 'localeString'}),
          ],
          preview: {select: {title: 'value', subtitle: 'label.zhTW'}},
        },
      ],
    }),
    // ── 服務介紹 ──
    defineField({
      name: 'servicesTitle',
      title: '服務區塊標題',
      type: 'localeString',
      group: 'services',
    }),
    defineField({
      name: 'featuredServices',
      title: '精選服務',
      type: 'array',
      description: '挑選要在首頁呈現的服務項目',
      group: 'services',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    }),
    // ── 方案介紹 ──
    defineField({
      name: 'plansTitle',
      title: '方案區塊標題',
      type: 'localeString',
      group: 'plans',
    }),
    defineField({
      name: 'featuredPlans',
      title: '精選方案',
      type: 'array',
      description: '挑選要在首頁呈現的方案',
      group: 'plans',
      of: [{type: 'reference', to: [{type: 'plan'}]}],
    }),
    // ── 最新消息 ──
    defineField({
      name: 'newsTitle',
      title: '消息區塊標題',
      type: 'localeString',
      group: 'news',
    }),
    defineField({
      name: 'showLatestNews',
      title: '顯示最新消息區塊',
      type: 'boolean',
      initialValue: true,
      group: 'news',
    }),
    // ── SEO ──
    defineField({
      name: 'seo',
      title: 'SEO 設定',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: '首頁設定'}
    },
  },
})
