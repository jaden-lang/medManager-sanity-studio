import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) => {
  const {t} = context.i18n // 取得翻譯函式，標題會跟著介面語言切換

  return S.list()
    .id('root')
    .title(t('med:menuTitle'))
    .items([
      // 設定（單例）：固定 documentId，不可重複建立
      S.listItem()
        .title(t('med:siteSettings'))
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      // 頁面（單例）
      S.listItem()
        .title(t('med:homePage'))
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.divider(),

      // 內容（一般清單）
      S.documentTypeListItem('service').title(t('med:service')),
      S.documentTypeListItem('plan').title(t('med:plan')),
      S.documentTypeListItem('news').title(t('med:news')),
    ])
}

// 單例型別集合：config 用它來隱藏「新建/複製/刪除」
export const singletonTypes = new Set(['siteSettings', 'homePage'])
