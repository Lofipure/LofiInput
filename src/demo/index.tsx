import LofiInput, { IMentionAtom } from 'LofiInput';
import React from 'react';
import './index.less';

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
    },
  ];

  return <LofiInput mentionList={mentionList} />;
};
