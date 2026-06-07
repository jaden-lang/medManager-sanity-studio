import type {NavbarProps} from 'sanity'
import {Box, Card, Flex} from '@sanity/ui'
import {LocaleSwitcher} from './LocaleSwitcher'

// 在預設導覽列下方加一條輕量 Card 放介面語言切換器，避免與既有圖示重疊。
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
