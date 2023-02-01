import LofiInput, { IMentionAtom } from 'LofiInput';
import React from 'react';
import './index.less';

const createOptions = (parentId: string) =>
  new Array(4).fill(1).map((_, index) => ({
    label: `[${parentId}]option_${index + 1}`,
    value: index + 1 + parentId,
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
      classname: 'select',
    },
  ];

  return <LofiInput mentionList={mentionList} placeholder="请输入......" />;
};
