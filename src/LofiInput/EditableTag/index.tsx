import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { IMentionAtom } from '../types';
import './index.less';

interface IEditableTagProps {
  value?: string;
  mentionAtom: IMentionAtom;
  showMentionChar?: boolean;
  onChange?: () => void;
  onEdit?: () => void;
}

const EditableTag: FC<IEditableTagProps> = ({
  mentionAtom,
  showMentionChar = false,
  onEdit,
  onChange,
}) => {
  const { classname, mentionChar, placeholder } = mentionAtom;
  const [editable, setEditable] = useState<boolean>(false);
  const tagContainerRef = useRef<HTMLSpanElement>(null);

  function handleDblClick(this: HTMLSpanElement) {
    if (tagContainerRef.current) {
      onEdit?.();
      setEditable(true);

      const selectionObj = window.getSelection();
      selectionObj?.removeAllRanges();
      const rangeObj = document.createRange();
      rangeObj?.selectNodeContents(this);
      selectionObj?.addRange(rangeObj);
    }
  }

  const handleOutofTag = (ev: MouseEvent) => {
    if (!tagContainerRef.current) return;
    const path = ev.composedPath();
    if (!path.includes(tagContainerRef.current)) {
      setEditable(false);
      onChange?.();
    }
  };

  const handleKeyPress = (ev: KeyboardEvent) => {
    if (['Enter', 'Space'].includes(ev.code)) {
      ev.preventDefault();
      setEditable(false);
      onChange?.();
      return;
    }
  };

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      tagEle.addEventListener('keypress', handleKeyPress);
      document.addEventListener('mousedown', handleOutofTag);
    }
  }, []);

  return (
    <span
      className={classNames('editable-tag', classname)}
      ref={tagContainerRef}
      contentEditable={editable}
      lofi-mention={showMentionChar ? mentionChar : ''}
      lofi-placeholder={placeholder}
    ></span>
  );
};

export default EditableTag;
