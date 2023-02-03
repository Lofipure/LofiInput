import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { render } from 'react-dom';
import { Key } from '../const';
import LofiSelectPanel, { ILofiSelectPanelHandler } from '../LofiSelectPanel';
import { IMentionDataSourceAtom, ISelectableTagProps } from '../types';
import './index.less';

const SelectableTag: FC<ISelectableTagProps> = ({
  mentionAtom,
  lofiInputEle,
  setLofiInputEditable,
}) => {
  const {
    classname,
    searchable,
    focusedItemClassname,
    panelWrapClassname,
    dataSource,
    mentionChar,
    placeholder,
  } = mentionAtom;
  const tagContainerRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>();
  const selectPanelRef = useRef<ILofiSelectPanelHandler>(null);
  const [curSelect, setCurSelect] = useState<IMentionDataSourceAtom>();
  const [tagEditable, setTagEditable] = useState<boolean>(false);

  const setCurTagEditable = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    setLofiInputEditable?.(false);
    setTagEditable(true);

    const selectionObj = window.getSelection();
    selectionObj?.removeAllRanges();
    const rangeObj = document.createRange();
    rangeObj?.selectNodeContents(tagEle);
    selectionObj?.addRange(rangeObj);

    setTimeout(() => {
      tagEle?.focus();
    });
  };

  const resetSelectionToInput = () => {
    const selection = window.getSelection();
    selection?.removeAllRanges();

    const range = document.createRange();
    range.selectNodeContents(lofiInputEle);
    range.collapse(false);

    selection?.addRange(range);
    setTimeout(() => {
      lofiInputEle.focus();
    });
  };

  const closeDropdown = () => {
    if (!dropdownRef.current) return;

    selectPanelRef.current?.setPanelVisible(false);
    dropdownRef.current.style.display = 'none';
  };

  const handleKeydown = (ev: KeyboardEvent) => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;
    // space 的话默认不搜索，结束～
    if ([Key.Space].includes(ev.code as any)) {
      ev.preventDefault();

      setLofiInputEditable?.(true);
      setTagEditable(false);

      closeDropdown();

      resetSelectionToInput();
      return;
    }
    // 这几个键要透传给 SelectPanel
    if ([Key.Up, Key.Down, Key.Enter].includes(ev.code as any)) {
      ev.preventDefault();
      selectPanelRef.current?.tranformKeyboardEvent(ev);

      if (ev.code === Key.Enter) {
        setTimeout(() => {
          selectPanelRef.current?.triggerSearch();
        });
      }
      return;
    }
    // 否则就触发搜索
    setTimeout(() => {
      const searchValue = tagEle.innerText;
      selectPanelRef.current?.triggerSearch(searchValue);
    });
  };

  const handleValueChange = async (item: IMentionDataSourceAtom) => {
    setCurSelect(item);
    closeDropdown();

    if (searchable) {
      setLofiInputEditable?.(true);
      setTagEditable(false);
    }
    selectPanelRef.current?.setPanelValue(item.value);

    resetSelectionToInput();
  };

  const openDropdown = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle || !mentionAtom?.dataSource) return;

    if (!dropdownRef.current) {
      const dropDownContent = document.createElement('div');
      dropDownContent.setAttribute('class', 'lofi-dropdown-container');
      dropdownRef.current = dropDownContent;

      const { height: inputHeight, left: inputLeft } =
        lofiInputEle.getBoundingClientRect();
      const { left: tagLeft } = tagEle.getBoundingClientRect();
      dropdownRef.current.style.top = inputHeight + 'px';
      dropdownRef.current.style.left = tagLeft - inputLeft + 'px';

      render(
        <LofiSelectPanel
          focusedItemClassname={focusedItemClassname}
          wrapClassname={panelWrapClassname}
          ref={selectPanelRef}
          options={dataSource?.data}
          onValueChange={handleValueChange}
        />,
        dropdownRef.current,
      );
    }

    dropdownRef.current.style.display = 'unset';
    selectPanelRef.current?.setPanelVisible(true);

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
    setTimeout(() => {
      if (searchable) {
        setCurTagEditable();
      }
    });
  };

  useEffect(() => {
    if (dataSource?.data)
      selectPanelRef.current?.setPanelOptions(dataSource?.data);
  }, [dataSource?.data]);

  useEffect(() => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      tagEle.addEventListener('dblclick', handleDblClick);
      tagEle.addEventListener('keydown', handleKeydown);
      document.addEventListener('click', handleOutofTag);

      openDropdown();

      setTimeout(() => {
        if (searchable) {
          setCurTagEditable();
        }
      });
    }

    return () => {
      tagEle?.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('click', handleOutofTag);
    };
  }, [searchable]);

  return (
    <span
      ref={tagContainerRef}
      className={classNames('selectable-tag', classname)}
      contentEditable={tagEditable}
      data-mention={mentionChar}
      data-placeholder={placeholder}
      data-value={curSelect?.value}
    >
      {curSelect?.label}
    </span>
  );
};

export default SelectableTag;
