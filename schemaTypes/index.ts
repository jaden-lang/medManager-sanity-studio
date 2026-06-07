// 多語型別（內容層）
import localeString from './localeString'
import localeText from './localeText'
import localeBlockContent from './localeBlockContent'
import blockContent from './blockContent'
import seo from './seo'

// 文件型別
import siteSettings from './siteSettings'
import homePage from './homePage'
import service from './service'
import plan from './plan'
import news from './news'

// 文件型別 → 介面翻譯鍵（命名空間 med）
const i18nTitleKeys: Record<string, string> = {
  siteSettings: 'med:siteSettings',
  homePage: 'med:homePage',
  service: 'med:service',
  plan: 'med:plan',
  news: 'med:news',
}

// i18nTitleKey 未列於公開型別中，於此集中以 spread 掛上；
// 讓型別標題（「建立新文件」清單、面板抬頭）跟著介面語言切換。
const withI18nTitle = <T extends {name: string}>(type: T): T =>
  i18nTitleKeys[type.name] ? {...type, i18nTitleKey: i18nTitleKeys[type.name]} : type

export const schemaTypes = [
  // 設定類（單例）
  siteSettings,
  homePage,
  // 內容類（清單）
  service,
  plan,
  news,
  // 共用 object（不需翻譯標題，會原樣通過）
  blockContent,
  localeString,
  localeText,
  localeBlockContent,
  seo,
].map(withI18nTitle)
