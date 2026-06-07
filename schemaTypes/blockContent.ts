import {defineArrayMember, defineType} from 'sanity'

// Portable Text 定義：localeBlockContent 的內層內容型別。
// 提供段落樣式、清單、行內標記，以及可裁切焦點的內嵌圖片。
export default defineType({
  name: 'blockContent',
  title: '內文',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: '內文', value: 'normal'},
        {title: '標題 H2', value: 'h2'},
        {title: '標題 H3', value: 'h3'},
        {title: '標題 H4', value: 'h4'},
        {title: '引言', value: 'blockquote'},
      ],
      lists: [
        {title: '項目符號', value: 'bullet'},
        {title: '編號', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: '粗體', value: 'strong'},
          {title: '斜體', value: 'em'},
          {title: '底線', value: 'underline'},
        ],
        annotations: [
          {
            name: 'link',
            title: '連結',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: '網址',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              },
              {
                name: 'blank',
                title: '另開新分頁',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: '圖片',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: '替代文字',
          type: 'string',
          description: '圖片無法顯示時的描述文字，也利於 SEO 與無障礙',
        },
      ],
    }),
  ],
})
