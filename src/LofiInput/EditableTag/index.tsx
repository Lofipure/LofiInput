import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { VALUE_WRAP_CLASS } from '../const';
import { IEditableTagProps } from '../types';
import { setSelectionAfterTarget } from '../utils';
import './index.less';

const EditableTag: FC<IEditableTagProps> = ({
  mentionAtom,
  lofiInputEle,
  defaultValue,
  setLofiInputEditable,
}) => {
  const { classname, placeholder } = mentionAtom;
  const [editable, setEditable] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(defaultValue?.value);
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
    }
  };

  const handleKeyDown = (ev: KeyboardEvent) => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;
    if (['Enter', 'Space'].includes(ev.code)) {
      ev.preventDefault();

      setLofiInputEditable?.(true);
      setEditable(false);

      setValue(tagContainerRef.current?.innerText);

      setSelectionAfterTarget(tagEle, lofiInputEle);
      return;
    }
  };

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      tagEle.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutofTag);

      if (!defaultValue) setCurTagEditable();
      if (defaultValue) window.getSelection()?.getRangeAt(0).collapse(false);
    }
  }, []);

  return (
    <span
      className={classNames('editable-tag', VALUE_WRAP_CLASS, classname)}
      ref={tagContainerRef}
      contentEditable={editable}
      data-placeholder={placeholder}
      data-mention={mentionAtom.mentionChar}
      data-value={value}
    >
      {value}
    </span>
  );
};

export default EditableTag;
