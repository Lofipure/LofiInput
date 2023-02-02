import classnames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import './index.less';
import { ILofiInputHandler, ILofiInputProps } from './types';
import { handleKeyDown } from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const { classname, mentionList, placeholder, wrapClassname } = props;
    const [editable, setEditable] = useState<boolean>(true);

    const inputRef = useRef<HTMLDivElement>(null);

    const setLofiInputEditable = (editable: boolean) => {
      setEditable(editable);
    };

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', (ev) =>
        handleKeyDown(inputEle, ev, mentionList, setLofiInputEditable),
      );
    }, []);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.innerText,
    }));

    return (
      <div className={classnames(wrapClassname, 'lofi-input-wrap')}>
        <div
          className={classnames(classname, 'lofi-input')}
          ref={inputRef}
          contentEditable={editable}
          data-placeholder={placeholder}
        ></div>
      </div>
    );
  },
);

export default LofiInput;
