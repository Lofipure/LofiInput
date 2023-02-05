import LofiInput, { IMentionAtom, LofiInputValue } from 'LofiInput';
import React, { ElementRef, useRef } from 'react';
import './index.less';

const createOptions = (parentId?: string) =>
  new Array(12).fill(1).map((_, index) => ({
    label: `${parentId ? `[${parentId}]` : ''}option_${index + 1}`,
    value: String(index + 1) + (parentId || ''),
  }));

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

  const handleValueChange = (value: LofiInputValue) => {
    console.log(value);
  };

  return (
    <div>
      <LofiInput
        ref={inputRef}
        mentionList={mentionList}
        placeholder="请输入, @ - 支持搜索, # - 不支持搜索, $ - 输入常数"
        onChange={handleValueChange}
      />
    </div>
  );
};
