// 內容支援語言清單（單一事實來源）
// 之後要新增/移除內容語言，只改這一個檔案，所有多語欄位會自動長出對應子欄位。
// 慣例：id 用 camelCase（會變成 schema 欄位名，避免會被當成路徑的字元）。
export const supportedLanguages = [
  {id: 'zhTW', title: '中文', isDefault: true},
  {id: 'en', title: 'English'},
]

export const baseLanguage = supportedLanguages.find((lang) => lang.isDefault)
