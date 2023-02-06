import LofiInput, {
  IMentionAtom,
  IPinPosition,
  LofiInputValue,
} from 'LofiInput';
import React, { ElementRef, useRef, useState } from 'react';
import './index.less';

const createOptions = (parentId?: string) =>
  new Array(12).fill(1).map((_, index) => ({
    label: `${parentId ? `[${parentId}]` : ''}option_${index + 1}`,
    value: String(index + 1) + (parentId || ''),
  }));

export default () => {
  const inputRef = useRef<ElementRef<typeof LofiInput>>(null);
  const [positionPin, setPositionPin] = useState<IPinPosition>();

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
        onBlur={(positionPin) => {
          setPositionPin(positionPin);
        }}
      />
      <div className="ctrl">
        <div
          className="btn"
          onClick={() => {
            inputRef.current?.focusAt(positionPin);
          }}
        >
          Focus At Last Position
        </div>
        <div
          className="btn"
          onClick={() => {
            inputRef.current?.focusAt(positionPin);
            inputRef.current?.insertMentionTag({
              mentionChar: '#',
              label: 'InsertTag',
              value: 'wuhu~~~',
            });
          }}
        >
          Insert {`{ mentionChar: "#", label: "InsertTag", value: "wuhu~~~" }`}
        </div>
        <div
          className="btn"
          onClick={() => {
            inputRef.current?.focusAt(positionPin);
            inputRef.current?.insertMentionTag({
              mentionChar: '$',
              label: '110',
              value: '110',
            });
          }}
        >
          Insert {`{ mentionChar: "$", label: "110", value: "110" }`}
        </div>
      </div>
    </div>
  );
};
