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
    const { classname, mentionList } = props;
    const [editable, setEditable] = useState<boolean>(true);

    const inputRef = useRef<HTMLDivElement>(null);

    const handleTagEdit = () => {
      setEditable(false);
    };

    const handleChange = () => {
      setEditable(true);
    };

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', function (ev) {
        handleKeyDown.bind(
          this,
          ev,
          mentionList,
          handleTagEdit,
          handleChange,
        )();
      });
      return () => {
        inputEle.removeEventListener('keydown', function (ev) {
          handleKeyDown.bind(
            this,
            ev,
            mentionList,
            handleTagEdit,
            handleChange,
          )();
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
        contentEditable={editable}
        lofi-placeholder="测试 placeholder"
      ></div>
    );
  },
);

export default LofiInput;
