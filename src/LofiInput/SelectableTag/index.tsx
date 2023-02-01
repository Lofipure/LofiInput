import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { IDisplayAtom, ISelectableTagProps } from '../types';
import './index.less';

const SelectableTag: FC<ISelectableTagProps> = ({
  mentionAtom,
  lofiInputEle,
}) => {
  const { classname } = mentionAtom;
  const tagContainerRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>();
  const [curDisplayCtx, setCurDisplayCtx] = useState<IDisplayAtom>();

  const closeDropdown = () => {
    if (!dropdownRef.current) return;
    dropdownRef.current.style.display = 'none';
  };

  const handleValueChange = async (item: IDisplayAtom) => {
    setCurDisplayCtx(item);
    closeDropdown();

    const selectionObj = window.getSelection();
    selectionObj?.removeAllRanges();

    const rangeObj = document.createRange();
    rangeObj.selectNodeContents(lofiInputEle);
    rangeObj.collapse(false);
    selectionObj?.addRange(rangeObj);

    lofiInputEle.focus();
  };

  const openDropdown = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    const selectionObj = window.getSelection();
    selectionObj?.removeAllRanges();

    if (!dropdownRef.current) {
      const dropDownContent = document.createElement('div');
      dropDownContent.setAttribute('class', 'lofi-dropdown-container');
      dropdownRef.current = dropDownContent;
      console.log(handleValueChange);

      const { height: inputHeight, left: inputLeft } =
        lofiInputEle.getBoundingClientRect();
      const { left: tagLeft } = tagEle.getBoundingClientRect();
      dropdownRef.current.style.top = inputHeight + 'px';
      dropdownRef.current.style.left = tagLeft - inputLeft + 'px';

      render(<span>旺铺招租</span>, dropdownRef.current);
    }
    dropdownRef.current.style.display = 'unset';

    lofiInputEle?.parentNode?.appendChild(dropdownRef.current);
  };

  const handleOutofTag = (ev: MouseEvent) => {
    if (!dropdownRef.current || !tagContainerRef.current) return;
    const path = ev.composedPath();

    if (
      !path.includes(dropdownRef.current) &&
      !path.includes(tagContainerRef.current)
    ) {
      closeDropdown();
    }
  };

  const handleDblClick = () => {
    openDropdown();
  };

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      document.addEventListener('click', handleOutofTag);

      openDropdown();
    }
  }, []);

  return (
    <span
      ref={tagContainerRef}
      className={classNames('selectable-tag', classname)}
      contentEditable={false}
      data-mention={mentionAtom.mentionChar}
      data-placeholder={'请选择哈哈哈哈哈哈哈'}
      data-value={curDisplayCtx?.value}
    >
      {curDisplayCtx?.label}
    </span>
  );
};

export default SelectableTag;
