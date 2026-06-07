import {useLocale} from 'sanity'
import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {CheckmarkIcon, TranslateIcon} from '@sanity/icons'

// 自製介面語言切換器。Sanity 5.x 移除了使用者選單裡內建的語言選單，這裡自己做一個。
export function LocaleSwitcher() {
  const {locales, currentLocale, changeLocale} = useLocale()
  if (locales.length < 2) return null // 只裝一種語言時不顯示

  const handleSelect = async (localeId: string) => {
    await changeLocale(localeId)
    window.location.reload() // structure 於載入時解析，需重載才會跟著換語言
  }

  return (
    <MenuButton
      id="studio-locale-switcher"
      button={
        <Button
          mode="bleed"
          icon={TranslateIcon}
          text={currentLocale.title}
          fontSize={1}
          padding={2}
        />
      }
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
