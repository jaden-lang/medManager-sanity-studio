# Sanity 後台配置指南（I18n × 欄位設計）

> 給下一個專案的 Sanity Studio 配置範本。整理自 `jdnsite/` 既有設定，含可直接複製的程式碼與套用步驟。
> 對應版本：Sanity Studio **5.x**（`useLocale`、`defineLocaleResourceBundle`、`i18nTitleKey` 皆為 5.x API）。

---

## 0. 設計總覽

這套後台的核心是**雙層 I18n**，務必先分清楚這兩層，否則很容易混淆：

| 層級 | 翻譯的對象 | 誰會看到 | 實作方式 |
| --- | --- | --- | --- |
| **內容層**（content） | 編輯填入的「資料」本身：標題、內文、按鈕字… | 網站訪客 | `localeString` / `localeText` / `localeBlockContent` 物件型別，欄位內含 `{zhTW, en}` |
| **介面層**（UI / chrome） | Studio 的「框架字」：左側選單、型別標題、分頁抬頭 | 後台編輯者 | `i18n.bundles` 語言包 + `i18nTitleKey` + `structure` 的 `t()` |

兩層彼此獨立：編輯者可以用「中文介面」去編輯「英文內容」，反之亦然。

目錄結構（只列與配置相關者）：

```
jdnsite/
├── sanity.config.ts          # 主配置：plugins、i18n bundles、singleton actions
├── sanity.cli.ts             # projectId / dataset / autoUpdates
├── structure.ts              # 左側選單結構 + 單例型別集合
├── i18n.ts                   # 介面語言包（選單/型別標題的中英對照）
├── components/
│   ├── StudioNavbar.tsx      # 自訂導覽列（掛語言切換器）
│   └── LocaleSwitcher.tsx    # 自製介面語言切換器
└── schemaTypes/
    ├── index.ts              # 彙整所有型別 + 掛 i18nTitleKey
    ├── supportedLanguages.ts # 內容支援語言清單（單一事實來源）
    ├── localeString.ts       # 多語字串
    ├── localeText.ts         # 多語長文字
    ├── localeBlockContent.ts # 多語內文（Portable Text）
    ├── blockContent.ts       # Portable Text 定義
    ├── seo.ts                # 可重用 SEO 物件
    ├── siteSettings.ts       # 單例：網站設定
    ├── homePage.ts           # 單例：首頁（用 groups 分頁）
    ├── service.ts            # 內容清單：服務項目
    ├── plan.ts               # 內容清單：方案
    └── news.ts               # 內容清單：最新消息
```

---

## 1. 內容多語：`locale*` 物件型別

### 1.1 支援語言（單一事實來源）

所有多語欄位都從這份清單動態長出來，**之後要加語言只改這一個檔案**。

`schemaTypes/supportedLanguages.ts`：

```ts
export const supportedLanguages = [
  {id: 'zhTW', title: '中文', isDefault: true},
  {id: 'en', title: 'English'},
]

export const baseLanguage = supportedLanguages.find((lang) => lang.isDefault)
```

> 慣例：`id` 用 camelCase（`zhTW`），因為它會變成 schema 欄位名，避免用會被當成路徑的字元。預設語言用 `isDefault: true` 標記，下游靠它決定 fallback 與「不收進翻譯摺疊區」。

### 1.2 三個多語型別

三者結構完全一致，差別只在內層 `type`。重點手法：

- 用 `supportedLanguages.map(...)` 動態產生子欄位 → 加語言零改動。
- 預設語言直接攤在外面；其他語言收進可摺疊的 `translations` fieldset → 編輯時預設只看到主語言，畫面乾淨。

`schemaTypes/localeString.ts`：

```ts
import {defineField, defineType} from 'sanity'
import {supportedLanguages} from './supportedLanguages'

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
```

`localeText.ts` 與上面唯一差別：`type: 'text'` 並加 `rows: 3`。
`localeBlockContent.ts` 與上面唯一差別：`type: 'blockContent'`（Portable Text）。

> 三個檔案幾乎是同一份樣板，套到新專案直接複製，只換內層 `type`。

### 1.3 在文件中使用

直接把欄位 `type` 設成 `localeString` 等即可：

```ts
defineField({name: 'heroTitle', title: '主視覺標題', type: 'localeString'})
defineField({name: 'heroSubtitle', title: '主視覺副標題', type: 'localeText'})
defineField({name: 'description', title: '詳細說明', type: 'localeBlockContent'})
```

> **注意 preview 的取值**：因為值是物件，`preview.select` 要指到子欄位，例如 `title: 'name.zhTW'`、`title: 'siteName.zhTW'`。同理 `slug` 的 `source` 要寫 `source: 'title.zhTW'`。

---

## 2. 介面多語：語言包 + 型別標題

這層讓**左側選單、型別標題、編輯面板抬頭**跟著 Studio 介面語言切換。

### 2.1 語言包 `i18n.ts`

```ts
import {defineLocaleResourceBundle} from 'sanity'

// 命名空間 'jdn'，鍵不含點號（避免被 i18next 當成巢狀路徑）
const zhHant = {
  menuTitle: '內容管理',
  siteSettings: '網站設定',
  homePage: '首頁',
  service: '服務項目',
  plan: '方案',
}

const en: typeof zhHant = {
  menuTitle: 'Content',
  siteSettings: 'Site Settings',
  homePage: 'Home Page',
  service: 'Services',
  plan: 'Plans',
}

export const jdnZhHantBundle = defineLocaleResourceBundle({
  locale: 'zh-Hant',
  namespace: 'jdn',
  resources: zhHant,
})

export const jdnEnBundle = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: 'jdn',
  resources: en,
})
```

> 命名空間自訂（這裡是 `jdn`，新專案換成自己的縮寫）。`en: typeof zhHant` 讓 TypeScript 強制兩份 key 一致，漏翻會編譯報錯。

### 2.2 型別標題翻譯 `i18nTitleKey`

`schemaTypes/index.ts` 在彙整型別時，順手把每個文件型別掛上 `i18nTitleKey`，這樣型別標題（「建立新文件」清單、面板抬頭）也會跟著介面語言切換：

```ts
// 文件型別 → 翻譯鍵
const i18nTitleKeys: Record<string, string> = {
  siteSettings: 'jdn:siteSettings',
  homePage: 'jdn:homePage',
  service: 'jdn:service',
  plan: 'jdn:plan',
}

// i18nTitleKey 未列於公開型別中，於此集中以 spread 掛上
const withI18nTitle = <T extends {name: string}>(type: T): T =>
  i18nTitleKeys[type.name] ? {...type, i18nTitleKey: i18nTitleKeys[type.name]} : type

export const schemaTypes = [
  siteSettings, homePage,           // 設定類
  service, plan,                    // 內容類
  blockContent, localeString, localeText, localeBlockContent, seo, // 共用 object
].map(withI18nTitle)
```

> object 型別（`localeString` 等）沒列在 `i18nTitleKeys` 裡，會原樣通過，不需翻譯標題。

### 2.3 在 structure 取用：`t('jdn:<key>')`

見第 3 節。

### 2.4 欄位標籤也要 i18n（field title）

⚠️ **重要釐清**：2.2 的 `i18nTitleKey` 只會翻譯「**文件型別標題**」與 Portable Text 的樣式／註解。**一般欄位的標籤**（`title: '標題'` 這種）Sanity 核心**不會**自動翻譯——`i18nTitleKey` 掛在欄位上沒有作用。

要讓欄位標籤跟著介面語言切換，得用「**自訂欄位元件**」在渲染時覆寫 `title`。作法是一個「吃翻譯鍵、回傳穩定元件」的工廠，掛到欄位的 `components.field`。

`components/i18nField.tsx`：

```tsx
import {useTranslation} from 'sanity'
import type {FieldProps} from 'sanity'
import type {ComponentType} from 'react'

// 以翻譯鍵為快取鍵：同一個 key 永遠回傳「同一個」元件實例，
// 確保元件身分穩定（避免每次 render 產生新元件導致重掛載）。
const cache = new Map<string, ComponentType<FieldProps>>()

/** 回傳一個會用 t(key) 覆寫欄位標籤的自訂欄位元件 */
export function i18nField(key: string): ComponentType<FieldProps> {
  const existing = cache.get(key)
  if (existing) return existing

  const Field = (props: FieldProps) => {
    const {t} = useTranslation() // 用完整鍵 'jdn:xxx'；namespace 已隨 i18n.bundles 載入
    // 覆寫 title 後交還預設渲染；其餘行為（驗證、摺疊…）完全不變
    return props.renderDefault({...props, title: t(key)})
  }

  cache.set(key, Field)
  return Field
}
```

再包一個像 `defineField` 的小助手，讓 schema 寫起來乾淨（`schemaTypes/i18nField.ts`）：

```ts
import {defineField} from 'sanity'
import {i18nField} from '../components/i18nField'

type FieldDef = Parameters<typeof defineField>[0]

/**
 * 與 defineField 用法相同，但欄位標籤會依介面語言翻譯。
 * 第一參數為語言包鍵（會自動補上 'jdn:' 命名空間）。
 */
export const tField = (key: string, def: FieldDef) =>
  defineField({...def, components: {field: i18nField(`jdn:${key}`)}})
```

在文件型別中改用 `tField`：

```ts
import {tField} from './i18nField'

// 之前：defineField({name: 'title', title: '標題', type: 'localeString'})
// 之後：
tField('newsTitle', {
  name: 'title',
  title: '標題', // 仍保留：命名空間載入前的 fallback 標籤
  type: 'localeString',
  validation: (Rule) => Rule.required(),
})
```

最後在語言包 `i18n.ts` 補上「欄位標籤」的鍵（值是要顯示的標籤字，與型別標題的鍵共用 `jdn` 命名空間）：

```ts
const zhHant = {
  // …型別標題的鍵…
  newsTitle: '標題',
  newsExcerpt: '摘要',
  newsBody: '內文',
}
const en: typeof zhHant = {
  // …
  newsTitle: 'Title',
  newsExcerpt: 'Excerpt',
  newsBody: 'Body',
}
```

> **取捨提醒**：每個要翻譯的欄位都得在語言包補一組鍵，欄位多時維護成本不低。常見折衷是**只翻跨團隊／對外會用到的關鍵欄位**，其餘標籤維持單一語言。要連 `description` 一起翻，比照覆寫 `props.description` 即可。
>
> 切換語言即時更新（`useTranslation` 是 reactive）；本專案的 `LocaleSwitcher` 本來就會 reload，兩種情況都正常。

---

## 3. 左側選單與單例 `structure.ts`

```ts
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) => {
  const {t} = context.i18n   // 取得翻譯函式，標題會跟著介面語言切換

  return S.list()
    .id('root')
    .title(t('jdn:menuTitle'))
    .items([
      // 設定（單例）：固定 documentId，不可重複建立
      S.listItem()
        .title(t('jdn:siteSettings'))
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      // 頁面（單例）
      S.listItem()
        .title(t('jdn:homePage'))
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // 內容（一般清單）
      S.documentTypeListItem('service').title(t('jdn:service')),
      S.documentTypeListItem('plan').title(t('jdn:plan')),
    ])
}

// 單例型別集合：config 用它來隱藏「新建/複製/刪除」
export const singletonTypes = new Set(['siteSettings', 'homePage'])
```

**單例（singleton）模式重點**：
1. structure 裡用 `S.document().documentId('固定ID')` 讓它永遠指向同一份文件。
2. `singletonTypes` 集合匯出給 `sanity.config.ts`，用來把這些型別從「建立新文件」模板移除，並隱藏複製/刪除動作（見第 4 節）。
3. 適合：網站設定、首頁、關於我們等「只會有一份」的文件。

---

## 4. 主配置 `sanity.config.ts`

```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {zhHantLocale} from '@sanity/locale-zh-hant'   // 官方繁中介面語言包
import {schemaTypes} from './schemaTypes'
import {structure, singletonTypes} from './structure'
import {StudioNavbar} from './components/StudioNavbar'
import {jdnZhHantBundle, jdnEnBundle} from './i18n'

export default defineConfig({
  name: 'default',
  title: '我的中文後台',

  projectId: 'i9rytw47',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), zhHantLocale()],

  // 掛上自訂介面語言包
  i18n: {
    bundles: [jdnZhHantBundle, jdnEnBundle],
  },

  // 用自訂導覽列（內含語言切換器）
  studio: {
    components: {navbar: StudioNavbar},
  },

  schema: {
    types: schemaTypes,
    // 單例不顯示在「建立新文件」清單中
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // 單例隱藏「複製」與「刪除」動作
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : input,
  },
})
```

`sanity.cli.ts`（部署用）：

```ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: 'i9rytw47', dataset: 'production'},
  deployment: {autoUpdates: true},
})
```

> 新專案要換掉 `projectId`（CLI 與 config 兩處都要）、`title`、語言包 import 名稱與命名空間。

---

## 5. 自製介面語言切換器

Sanity 5.x 移除了使用者選單裡內建的語言選單，所以這套自己做一個，放在導覽列下方一條獨立工具列。

`components/StudioNavbar.tsx`：在預設導覽列下方加一條輕量 Card 放切換器，避免與既有圖示重疊。

```tsx
import type {NavbarProps} from 'sanity'
import {Box, Card, Flex} from '@sanity/ui'
import {LocaleSwitcher} from './LocaleSwitcher'

export function StudioNavbar(props: NavbarProps) {
  return (
    <Flex direction="column">
      <Box>{props.renderDefault(props)}</Box>
      <Card borderBottom paddingX={3} paddingY={1} tone="transparent">
        <Flex justify="flex-end" align="center">
          <LocaleSwitcher />
        </Flex>
      </Card>
    </Flex>
  )
}
```

`components/LocaleSwitcher.tsx`：用 `useLocale()` 取得語言清單與切換函式；切換後 `window.location.reload()`，確保左側選單（structure 在載入時解析）也一起更新。

```tsx
import {useLocale} from 'sanity'
import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {CheckmarkIcon, TranslateIcon} from '@sanity/icons'

export function LocaleSwitcher() {
  const {locales, currentLocale, changeLocale} = useLocale()
  if (locales.length < 2) return null   // 只裝一種語言時不顯示

  const handleSelect = async (localeId: string) => {
    await changeLocale(localeId)
    window.location.reload()   // structure 於載入時解析，需重載才會跟著換語言
  }

  return (
    <MenuButton
      id="studio-locale-switcher"
      button={<Button mode="bleed" icon={TranslateIcon} text={currentLocale.title} fontSize={1} padding={2} />}
      menu={
        <Menu>
          {locales.map((locale) => (
            <MenuItem
              key={locale.id}
              text={locale.title}
              iconRight={locale.id === currentLocale.id ? CheckmarkIcon : undefined}
              onClick={() => handleSelect(locale.id)}
            />
          ))}
        </Menu>
      }
      popover={{portal: true}}
    />
  )
}
```

> 切換後寫入 `localStorage`（key：`sanity-locale:<projectId>:<workspace>`），每位編輯者各自記住偏好。
> 介面要有幾種語言可選，取決於 `plugins` 裝了哪些介面語言包（這裡裝了 `zhHantLocale()`，加上 Studio 內建的 en-US，共兩種）。

---

## 6. 文件欄位設計慣例

從既有 schema 萃取出的可重用慣例，新專案照抄即可。

### 6.1 用 `groups` 把長文件分頁

`homePage.ts` 欄位很多，用 `groups` 切成分頁（首屏／服務／方案／SEO…），編輯體驗大幅改善：

```ts
defineType({
  name: 'homePage',
  type: 'document',
  groups: [
    {name: 'hero', title: '首屏 Hero'},
    {name: 'services', title: '服務介紹'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroTitle', title: '主視覺標題', type: 'localeString', group: 'hero'}),
    defineField({name: 'seo', title: 'SEO 設定', type: 'seo', group: 'seo'}),
    // …
  ],
})
```

### 6.2 可重用 SEO 物件 `seo.ts`

把 SEO 抽成獨立 object 型別，任何頁面/文件加一個 `type: 'seo'` 欄位即可共用：

```ts
defineType({
  name: 'seo',
  title: 'SEO 設定',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'metaTitle', title: 'SEO 標題', type: 'localeString',
      description: '搜尋結果與瀏覽器分頁顯示的標題，建議 60 字以內'}),
    defineField({name: 'metaDescription', title: 'SEO 描述', type: 'localeText',
      description: '搜尋結果摘要，建議 160 字以內'}),
    defineField({name: 'ogImage', title: '分享預覽圖', type: 'image', options: {hotspot: true},
      description: '分享到社群媒體時顯示的縮圖，建議 1200×630'}),
    defineField({name: 'keywords', title: '關鍵字', type: 'array',
      of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'noIndex', title: '不被搜尋引擎收錄', type: 'boolean', initialValue: false}),
  ],
})
```

### 6.3 常用欄位手法速查

| 需求 | 寫法 |
| --- | --- |
| 必填 | `validation: (Rule) => Rule.required()` |
| 數量上限 | `validation: (Rule) => Rule.max(4)` |
| 網址代稱 | `type: 'slug', options: {source: 'title.zhTW', maxLength: 96}` |
| 圖片可裁切焦點 | `type: 'image', options: {hotspot: true}` |
| 下拉選單（固定選項） | `type: 'string', options: {list: [{title:'…', value:'…'}]}` |
| 標籤式陣列 | `type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}` |
| 引用其他文件 | `type: 'array', of: [{type: 'reference', to: {type: 'service'}}]` |
| 手動排序 | 欄位 `order: number` + 文件 `orderings` 設 `by: [{field: 'order', direction: 'asc'}]` |
| 內嵌物件陣列 | `of: [{type: 'object', fields: [...], preview: {...}}]`（如 hero 數據亮點、流程步驟） |
| 清單預覽取多語值 | `preview: {select: {title: 'name.zhTW', media: 'image'}}` |
| 單例固定預覽標題 | `preview: {prepare() {return {title: '首頁設定'}}}` |

> **descriptions 寫給編輯看**：既有 schema 大量用 `description` 寫使用提示（字數上限、尺寸建議、用途），新專案維持這個習慣，能大幅減少編輯誤用。

### 6.4 一份文件型別的標準骨架

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: '服務項目',
  type: 'document',
  fields: [
    defineField({name: 'title', title: '服務名稱', type: 'localeString',
      validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: '網址代稱', type: 'slug',
      options: {source: 'title.zhTW', maxLength: 96},
      validation: (Rule) => Rule.required()}),
    defineField({name: 'order', title: '排列順序', type: 'number'}),
    defineField({name: 'seo', title: 'SEO 設定', type: 'seo'}),
  ],
  orderings: [
    {title: '排列順序', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title.zhTW', media: 'image'}},
})
```

### 6.5 完整範例：新增「最新消息（news）」型別（端到端）

以「最新消息」示範**新增一個內容型別要動到的所有檔案**。這個型別也順帶展示了前面沒出現過的手法：`datetime` 日期、`radio` 單選排版、`initialValue` 預設值、以及用 `prepare()` 把預覽副標格式化成日期。

> 下面範例的欄位**標籤**先寫死中文（`title: '標題'`）。欄位的**值**已是多語（`localeString` 等）；若要連標籤也隨介面語言切換，把 `defineField` 換成第 2.4 節的 `tField` 即可。

#### ① 寫 schema：`schemaTypes/news.ts`

```ts
import {defineField, defineType} from 'sanity'

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
```

#### ② 註冊型別 + 掛標題翻譯：`schemaTypes/index.ts`

```ts
import news from './news'   // ← 新增 import

const i18nTitleKeys: Record<string, string> = {
  siteSettings: 'jdn:siteSettings',
  homePage: 'jdn:homePage',
  service: 'jdn:service',
  plan: 'jdn:plan',
  news: 'jdn:news',          // ← 新增
}

export const schemaTypes = [
  siteSettings, homePage,
  service, plan, news,        // ← 加入清單
  blockContent, localeString, localeText, localeBlockContent, seo,
].map(withI18nTitle)
```

#### ③ 補介面翻譯：`i18n.ts`

```ts
const zhHant = {
  // …既有的鍵…
  news: '最新消息',           // ← 新增
}

const en: typeof zhHant = {
  // …既有的鍵…
  news: 'News',              // ← 新增（typeof zhHant 會強制兩邊一致）
}
```

#### ④ 加進左側選單：`structure.ts`

```ts
// 內容（清單）區塊裡加一行
S.documentTypeListItem('service').title(t('jdn:service')),
S.documentTypeListItem('plan').title(t('jdn:plan')),
S.documentTypeListItem('news').title(t('jdn:news')),   // ← 新增
```

> news 是一般清單（會有很多筆），所以**不必**動 `singletonTypes`、config 的 `templates` 或 `document.actions`——那些只給單例用。

#### ⑤ 前端讀取（對齊第 7 節契約）

```ts
const title = t(news.title, locale)            // 多語標題
const excerpt = t(news.excerpt, locale)        // 多語摘要
const body = tBlocks(news.body, locale)        // 多語內文
const date = new Date(news.publishedAt).toLocaleDateString('zh-TW')
```

> GROQ 查詢時依 `isPinned` 與 `publishedAt` 排序即可，例如：
> `*[_type == "news"] | order(isPinned desc, publishedAt desc)`

---

## 7. 前端讀取契約

後台的 `locale*` 物件在前端要用 helper 取值並做 fallback。對應 `front-web/src/lib/locale.ts`：

```ts
export const SUPPORTED_LOCALES = ["zhTW", "en"] as const;  // 與 supportedLanguages.ts 對齊
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zhTW";

// 取多語字串；找不到目前語言時退回預設語言
export function t(field: LocaleString | undefined | null, locale: Locale = DEFAULT_LOCALE): string {
  if (!field) return "";
  return field[locale] ?? field[DEFAULT_LOCALE] ?? field.en ?? "";
}

// 取多語 Portable Text
export function tBlocks(field: LocaleBlockContent | undefined | null, locale: Locale = DEFAULT_LOCALE) {
  if (!field) return [];
  return field[locale] ?? field[DEFAULT_LOCALE] ?? field.en ?? [];
}
```

> 重點：**前端的 `SUPPORTED_LOCALES` 必須與後台 `supportedLanguages.ts` 保持一致**。fallback 鏈：目前語言 → 預設語言（zhTW）→ en → 空值，確保某語言漏填時頁面不會破。

---

## 8. 套用到新專案的步驟

1. **建立 Studio**：`npm create sanity@latest`，選 TypeScript、Clean project。
2. **改 ID 與標題**：`sanity.config.ts` 和 `sanity.cli.ts` 的 `projectId` / `dataset` / `title`。
3. **複製 I18n 骨架**（幾乎零改動）：
   - `supportedLanguages.ts`：定好內容要支援哪些語言。
   - `localeString.ts` / `localeText.ts` / `localeBlockContent.ts`：直接複製。
   - `i18n.ts`：換命名空間（`jdn` → 新縮寫），改 `resources` 的選單字。
4. **複製 UI 切換器**：`StudioNavbar.tsx` + `LocaleSwitcher.tsx` 原樣複製；config 掛上 `studio.components.navbar` 與官方介面語言包（如 `zhHantLocale()`）。
5. **規劃 structure**：列出單例 vs 清單型別，填 `singletonTypes`，config 接上 `templates` 與 `document.actions` 過濾。
6. **設計文件型別**：套第 6 節慣例 —— 長文件用 `groups`、SEO 抽成 `seo` object、多語欄位用 `locale*`、preview 記得指到 `.zhTW` 子欄位。
7. **掛型別標題翻譯**：在 `schemaTypes/index.ts` 補 `i18nTitleKeys` 並 `.map(withI18nTitle)`。
8. **前端對齊**：複製 `locale.ts` 的 `t()` / `tBlocks()`，`SUPPORTED_LOCALES` 與後台對齊。
9.（選用）**寫 seed 腳本**：用 `getCliClient()` + `createOrReplace` 灌入佔位文案（idempotent，可重複執行）。

---

## 9. 容易踩的坑

- **preview / slug source 要指子欄位**：多語欄位是物件，`title: 'name'` 會空白，必須 `title: 'name.zhTW'`、`source: 'title.zhTW'`。
- **語言包的 key 不要含點號**：`.` 會被 i18next 當巢狀路徑，鍵名用純字串（如 `siteSettings` 而非 `site.settings`）。
- **切換介面語言後 structure 不會即時更新**：因為 structure 在載入時解析，所以 `LocaleSwitcher` 切換後要 `window.location.reload()`。
- **單例要三處一致**：structure 用固定 `documentId`、`singletonTypes` 集合、config 的 `templates` + `document.actions` 都要涵蓋，少一個就會出現「能建立第二份」或「能刪掉」的破口。
- **新增內容語言**：只改 `supportedLanguages.ts`（後台）與 `SUPPORTED_LOCALES`（前端）即可長出欄位；但**新增介面語言**還要裝對應的 Sanity 介面語言包並在 `i18n.bundles` 補一份自訂語言包。
```
