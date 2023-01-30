import classnames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import './index.less';
import { ILofiInputHandler, ILofiInputProps } from './types';
import { handleKeyDown } from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const { classname, mentionList } = props;
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', function (ev) {
        handleKeyDown.bind(this, ev, mentionList)();
      });
      return () => {
        inputEle.removeEventListener('keydown', function (ev) {
          handleKeyDown.bind(this, ev, mentionList)();
        });
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.innerText,
    }));

    return (
      <div
        className={classnames(classname, 'lofi-input')}
        ref={inputRef}
        contentEditable={true}
        lofi-placeholder="测试 placeholder"
      ></div>
    );
  },
);

export default LofiInput;
