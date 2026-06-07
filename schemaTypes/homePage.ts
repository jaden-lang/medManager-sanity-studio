import {defineField, defineType} from 'sanity'

// 單例：首頁。欄位多，用 groups 切成分頁改善編輯體驗。
// 分頁順序對齊前端區塊出現順序：Hero → 服務 → 為什麼選我們 → 方案 → 最新消息 → 使用流程 → 行動呼籲。
export default defineType({
  name: 'homePage',
  title: '首頁',
  type: 'document',
  groups: [
    {name: 'hero', title: '首屏 Hero'},
    {name: 'services', title: '服務介紹'},
    {name: 'why', title: '為什麼選我們'},
    {name: 'plans', title: '方案介紹'},
    {name: 'news', title: '最新消息'},
    {name: 'process', title: '使用流程'},
    {name: 'cta', title: '行動呼籲'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── 首屏 Hero ──
    defineField({
      name: 'heroBadge',
      title: '主視覺標籤',
      type: 'localeString',
      description: '大標題上方的小標籤，例如「全新上線」',
      group: 'hero',
    }),
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
      description: '例如：/register 或完整網址',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaText',
      title: '主視覺次要按鈕文字',
      type: 'localeString',
      description: '主按鈕旁的次要按鈕，例如「查看方案」',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaUrl',
      title: '主視覺次要按鈕連結',
      type: 'string',
      description: '例如：#plans 或完整網址',
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
      name: 'servicesEyebrow',
      title: '服務區塊小標',
      type: 'localeString',
      description: '區塊大標上方的小字',
      group: 'services',
    }),
    defineField({
      name: 'servicesTitle',
      title: '服務區塊標題',
      type: 'localeString',
      group: 'services',
    }),
    defineField({
      name: 'servicesSubheading',
      title: '服務區塊副標',
      type: 'localeText',
      description: '區塊大標下方的說明文字',
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
    // ── 為什麼選我們 ──
    defineField({
      name: 'whyEyebrow',
      title: '小標',
      type: 'localeString',
      group: 'why',
    }),
    defineField({
      name: 'whyHeading',
      title: '標題',
      type: 'localeString',
      group: 'why',
    }),
    defineField({
      name: 'whyBody',
      title: '說明',
      type: 'localeText',
      group: 'why',
    }),
    defineField({
      name: 'whyCtaText',
      title: '按鈕文字',
      type: 'localeString',
      group: 'why',
    }),
    defineField({
      name: 'whyCtaUrl',
      title: '按鈕連結',
      type: 'string',
      description: '例如：/about 或完整網址',
      group: 'why',
    }),
    defineField({
      name: 'whyPoints',
      title: '重點項目',
      type: 'array',
      description: '右側條列的優勢卡片，每筆「標題 + 說明」',
      group: 'why',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: '標題', type: 'localeString'}),
            defineField({name: 'description', title: '說明', type: 'localeText'}),
          ],
          preview: {select: {title: 'title.zhTW', subtitle: 'description.zhTW'}},
        },
      ],
    }),
    // ── 方案介紹 ──
    defineField({
      name: 'plansEyebrow',
      title: '方案區塊小標',
      type: 'localeString',
      group: 'plans',
    }),
    defineField({
      name: 'plansTitle',
      title: '方案區塊標題',
      type: 'localeString',
      group: 'plans',
    }),
    defineField({
      name: 'plansSubheading',
      title: '方案區塊副標',
      type: 'localeText',
      group: 'plans',
    }),
    defineField({
      name: 'plansNote',
      title: '方案區塊備註',
      type: 'localeText',
      description: '價格卡下方的小字備註',
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
      name: 'newsEyebrow',
      title: '消息區塊小標',
      type: 'localeString',
      group: 'news',
    }),
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
    // ── 使用流程 ──
    defineField({
      name: 'processEyebrow',
      title: '小標',
      type: 'localeString',
      group: 'process',
    }),
    defineField({
      name: 'processHeading',
      title: '標題',
      type: 'localeString',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: '流程步驟',
      type: 'array',
      description: '依序排列的使用步驟，建議 3–5 步',
      group: 'process',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'stepNo',
              title: '步驟編號',
              type: 'string',
              description: '例如：01、02',
            }),
            defineField({name: 'title', title: '標題', type: 'localeString'}),
            defineField({name: 'description', title: '說明', type: 'localeText'}),
          ],
          preview: {select: {title: 'title.zhTW', subtitle: 'stepNo'}},
        },
      ],
    }),
    // ── 行動呼籲 CTA ──
    defineField({
      name: 'ctaHeading',
      title: '標題',
      type: 'localeString',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: '副標',
      type: 'localeText',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryText',
      title: '主要按鈕文字',
      type: 'localeString',
      group: 'cta',
    }),
    defineField({
      name: 'ctaPrimaryUrl',
      title: '主要按鈕連結',
      type: 'string',
      description: '例如：/register 或完整網址',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryText',
      title: '次要按鈕文字',
      type: 'localeString',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSecondaryUrl',
      title: '次要按鈕連結',
      type: 'string',
      description: '例如：/contact 或完整網址',
      group: 'cta',
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
