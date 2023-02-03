import { Button } from 'antd';
import LofiInput, { IMentionAtom } from 'LofiInput';
import React, { ElementRef, useRef } from 'react';
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
  const inputRef = useRef<ElementRef<typeof LofiInput>>(null);
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

  return (
    <div>
      <LofiInput
        ref={inputRef}
        mentionList={mentionList}
        placeholder="请输入, @ - 支持搜索, # - 不支持搜索, $ - 输入常数"
        onChange={(value) => {
          console.log(
            '[🔧 Debug 🔧]',
            'value',
            value.map((item) => item.value),
          );
        }}
      />
      <Button
        onClick={() => {
          const value = inputRef.current?.getValue();
          console.log('[🔧 Debug 🔧]', 'kankan value', value);
        }}
      >
        Get Value
      </Button>
    </div>
  );
};
