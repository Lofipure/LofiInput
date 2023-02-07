import LofiInput, { ILofiInputProps, IPinPosition } from 'LofiInput';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { initialValue, mentionList } from './config';
import './index.less';

export default () => {
  const inputRef = useRef<ElementRef<typeof LofiInput>>(null);
  const [positionPin, setPositionPin] = useState<IPinPosition>();

  const handleBlur: ILofiInputProps['onBlur'] = (positionPin) => {
    setPositionPin(positionPin);
  };

  useEffect(() => {
    inputRef.current?.setValue(initialValue);
  }, []);

  return (
    <div>
      <LofiInput mentionList={mentionList} ref={inputRef} onBlur={handleBlur} />
      <div className="ctrl">
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
        <div
          className="btn"
          onClick={() => {
            inputRef.current?.focusAt(positionPin);
            inputRef.current?.insertMentionTag({
              mentionChar: '@',
              label: 'InsertSearchTag',
              value: 'yayaya~',
            });
          }}
        >
          Insert{' '}
          {`{ mentionChar: "@", label: "InsertSearchTag", value: "yayaya~" }`}
        </div>
        <div
          className="btn"
          onClick={() => inputRef.current?.insertTextNode('+-*/')}
        >
          InsertTextNode{"'+-*/'"}
        </div>
        <div
          className="btn"
          onClick={() => {
            inputRef.current?.setValue([
              {
                label: '[search]option_1',
                value: '1search',
                mention: '@',
                isText: false,
              },
              {
                label: '+',
                value: '+',
                isText: true,
              },
              {
                label: '[search]option_2',
                value: '2search',
                mention: '@',
                isText: false,
              },
              {
                label: '-',
                value: '-',
                isText: true,
              },
              {
                label: '[select]option_3',
                value: '3select',
                mention: '#',
                isText: false,
              },
              {
                label: '+',
                value: '+',
                isText: true,
              },
              {
                label: '100',
                value: '100',
                mention: '$',
                isText: false,
              },
            ]);
          }}
        >
          Set Value
        </div>
      </div>
    </div>
  );
};
