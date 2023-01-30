import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { IMentionAtom } from '../types';
import './index.less';

interface IEditableTagProps {
  value?: string;
  mentionAtom: IMentionAtom;
  onChange?: (value: string) => void;
}

const EditableTag: FC<IEditableTagProps> = ({ mentionAtom, onChange }) => {
  const { classname, mentionChar, placeholder } = mentionAtom;
  const [editable, setEditable] = useState<boolean>(false);
  const tagContainerRef = useRef<HTMLSpanElement>(null);

  function handleDblClick(this: HTMLSpanElement) {
    if (tagContainerRef.current) {
      setEditable(true);
      onChange?.(tagContainerRef.current?.innerText);
    }
  }

  const handleOutofTag = (ev: MouseEvent) => {
    if (!tagContainerRef.current) return;
    const path = (ev as any)?.path as HTMLElement[];
    if (!path.includes(tagContainerRef.current)) {
      setEditable(false);
    }
  };

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      document.addEventListener('mousedown', handleOutofTag);
    }
  }, []);

  return (
    <span
      className={classNames('editable-tag', classname)}
      ref={tagContainerRef}
      contentEditable={editable}
      lofi-mention={mentionChar}
      lofi-placeholder={placeholder}
    >
      {/* {placeholder} */}
    </span>
  );
};

export default EditableTag;
