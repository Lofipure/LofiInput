import LofiInput, {
  ILofiInputProps,
  IPinPosition,
  LofiInputValue,
} from 'LofiInput';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { initialValue, mentionList } from './config';
import './index.less';

export default () => {
  const [value, setValue] = useState<LofiInputValue>([]);
  const inputRef = useRef<ElementRef<typeof LofiInput>>(null);
  const lastPositionPin = useRef<IPinPosition>();

  const handleValueChange: ILofiInputProps['onChange'] = (list) => {
    setValue(list);
  };

  const handleBlur: ILofiInputProps['onBlur'] = (positionPin) => {
    lastPositionPin.current = positionPin;
  };

  useEffect(() => {
    inputRef.current?.setValue(initialValue);
  }, []);

  return (
    <div>
      <LofiInput
        mentionList={mentionList}
        onChange={handleValueChange}
        onBlur={handleBlur}
        ref={inputRef}
        placeholder="定位钉使用方法"
      />
      <div className="panel">
        <div
          className="pin-btn"
          onClick={() => {
            inputRef.current?.focusAt(lastPositionPin.current);
          }}
        >
          Focus Last
        </div>
        {value.map((item) => (
          <div
            className="pin-btn"
            key={`${item.value}-${item.mention}`}
            onClick={() => {
              inputRef.current?.focusAt(item.positionPin);
            }}
          >
            {item.label ?? item.value}
          </div>
        ))}
      </div>
    </div>
  );
};
