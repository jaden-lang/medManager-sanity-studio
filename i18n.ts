import {defineLocaleResourceBundle} from 'sanity'

// 介面語言包（左側選單 / 型別標題的中英對照）。
// 命名空間 'med'，鍵不含點號（避免被 i18next 當成巢狀路徑）。
const zhHant = {
  menuTitle: '內容管理',
  siteSettings: '網站設定',
  homePage: '首頁',
  service: '服務項目',
  plan: '方案',
  news: '最新消息',
}

// typeof zhHant 強制兩份 key 一致，漏翻會編譯報錯。
const en: typeof zhHant = {
  menuTitle: 'Content',
  siteSettings: 'Site Settings',
  homePage: 'Home Page',
  service: 'Services',
  plan: 'Plans',
  news: 'News',
}

export const medZhHantBundle = defineLocaleResourceBundle({
  locale: 'zh-Hant',
  namespace: 'med',
  resources: zhHant,
})

export const medEnBundle = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: 'med',
  resources: en,
})
