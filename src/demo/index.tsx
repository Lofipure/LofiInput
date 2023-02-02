import LofiInput, { IMentionAtom } from 'LofiInput';
import React from 'react';
import './index.less';

const createOptions = (parentId?: string) =>
  new Array(12).fill(1).map((_, index) => ({
    label: `${parentId ? `[${parentId}]` : ''}option_${index + 1}`,
    value: String(index + 1) + (parentId || ''),
  }));

const options = createOptions('').map((item) => ({
  ...item,
  children: createOptions(item.value).map((atom) => ({
    ...atom,
    children: createOptions(item.value + atom.value),
  })),
}));
console.log(options);

export default () => {
  const mentionList: IMentionAtom[] = [
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
      searchable: false,
    },
  ];

  return <LofiInput mentionList={mentionList} placeholder="请输入......" />;
};
