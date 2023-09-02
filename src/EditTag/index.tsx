import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { VALUE_WRAP_CLASS } from '../const';
import { ITagProps } from '../types';
import { setSelectionAfterTarget } from '../utils';
import './index.less';

const EditTag: FC<ITagProps> = ({
  mentionAtom,
  inputEle,
  defaultValue,
  onChange,
  setExpressionEditable,
}) => {
  const { classname, placeholder, showMentionCharBefore } = mentionAtom;
  const [editable, setEditable] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(defaultValue?.value);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const setCurTagEditable = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    setExpressionEditable?.(false);
    setEditable(true);

    const selectionObj = window.getSelection();
    selectionObj?.removeAllRanges();
    const rangeObj = document.createRange();
    rangeObj.selectNodeContents(tagEle);
    selectionObj?.addRange(rangeObj);

    setTimeout(() => {
      tagEle.focus();
    });
  };

  const handleDblClick = () => {
    setCurTagEditable();
  };

  const setCurInnerTextAsValue = (resetToInput: boolean) => {
    if (!tagContainerRef.current) return;
    setExpressionEditable?.(true);
    setEditable(false);

    setValue(tagContainerRef.current?.innerText);

    if (resetToInput) {
      onChange?.();
      setSelectionAfterTarget(tagContainerRef.current, inputEle);
    }
  };

  const handleOutofTag = (ev: MouseEvent) => {
    if (!tagContainerRef.current) return;
    const path = ev.composedPath();

    if (!path.includes(tagContainerRef.current)) {
      setCurInnerTextAsValue(false);
    }
  };

  const handleKeyDown = (ev: KeyboardEvent) => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;
    if (['Enter', 'Space'].includes(ev.code)) {
      setCurInnerTextAsValue(true);
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
      className={classNames('edit-tag', VALUE_WRAP_CLASS, classname, {
        'edit-tag-show-mention': showMentionCharBefore,
      })}
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

export default EditTag;
