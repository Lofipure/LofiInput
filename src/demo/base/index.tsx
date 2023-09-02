import LofiInput from 'LofiInput';
import { IMentionAtom } from 'LofiInput/types';
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

  return (
    <div>
      <LofiInput
        mentionList={mentionList}
        ref={inputRef}
        placeholder="请输入......"
      />
    </div>
  );
};
