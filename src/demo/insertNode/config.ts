import { IMentionAtom } from 'LofiInput';

export const createOptions = (parentId?: string) =>
  new Array(12).fill(1).map((_, index) => ({
    label: `${parentId ? `[${parentId}]` : ''}option_${index + 1}`,
    value: String(index + 1) + (parentId || ''),
  }));

export const mentionList: IMentionAtom[] = [
  {
    mentionChar: '$',
    classname: 'edit',
    mode: 'editable',
    placeholder: '请输入常数',
  },
  {
    mentionChar: '@',
    mode: 'selectable',
    classname: 'search',
    dataSource: {
      type: 'select',
      data: createOptions('search'),
    },
    placeholder: '支持搜索',
    searchable: true,
  },
  {
    mentionChar: '#',
    mode: 'selectable',
    classname: 'select',
    dataSource: {
      type: 'select',
      data: createOptions('select'),
    },
    placeholder: '不支持搜索',
    searchable: false,
  },
];

export const initialValue = [
  {
    label: '[search]option_1',
    value: '1search',
    mention: '@',
    isText: false,
  },
  {
    label: '-',
    value: '-',
    isText: true,
  },
  {
    label: '[select]option_1',
    value: '1select',
    mention: '#',
    isText: false,
  },
  {
    label: '*',
    value: '*',
    isText: true,
  },
  {
    label: '(',
    value: '(',
    isText: true,
  },
  {
    label: '100',
    value: '100',
    mention: '$',
    isText: false,
  },
  {
    label: '+',
    value: '+',
    isText: true,
  },
  {
    label: '[select]option_1',
    value: '1select',
    mention: '#',
    isText: false,
  },
  {
    label: ')',
    value: ')',
    isText: true,
  },
];
