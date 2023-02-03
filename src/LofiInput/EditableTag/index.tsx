import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { IEditableTagProps } from '../types';
import './index.less';

const EditableTag: FC<IEditableTagProps> = ({
  mentionAtom,
  lofiInputEle,
  setLofiInputEditable,
}) => {
  const { classname, placeholder } = mentionAtom;
  const [editable, setEditable] = useState<boolean>(false);
  const [value, setValue] = useState<string>();
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const setCurTagEditable = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    setLofiInputEditable?.(false);
    setEditable(true);

    // selection 选择当前 tag作为锚点
    const selectionObj = window.getSelection();
    selectionObj?.removeAllRanges();
    const rangeObj = document.createRange();
    rangeObj?.selectNodeContents(tagEle);
    selectionObj?.addRange(rangeObj);

    setTimeout(() => {
      tagEle?.focus();
    });
  };

  const handleDblClick = () => {
    setCurTagEditable();
  };

  const handleOutofTag = (ev: MouseEvent) => {
    if (!tagContainerRef.current) return;
    const path = ev.composedPath();
    if (!path.includes(tagContainerRef.current)) {
      setLofiInputEditable?.(true);
      setEditable(false);

      // setTimeout(() => {
      //   onChange?.();
      // });
    }
  };

  const handleKeyDown = (ev: KeyboardEvent) => {
    if (['Enter', 'Space'].includes(ev.code)) {
      ev.preventDefault();

      setLofiInputEditable?.(true);
      setEditable(false);

      setValue(tagContainerRef.current?.innerText);

      // selection 选择 input元素作为锚点
      const selection = window.getSelection();
      selection?.removeAllRanges();

      const range = document.createRange();
      range.selectNodeContents(lofiInputEle);
      range.collapse(false);

      selection?.addRange(range);

      setTimeout(() => {
        lofiInputEle.focus();
      });
      return;
    }
  };

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      tagEle.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutofTag);

      setCurTagEditable();
    }
  }, []);

  return (
    <span
      className={classNames('editable-tag', classname)}
      ref={tagContainerRef}
      contentEditable={editable}
      data-placeholder={placeholder}
      data-mention={mentionAtom.mentionChar}
      data-value={value}
    ></span>
  );
};

export default EditableTag;
