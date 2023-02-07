import classNames from 'classnames';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { render } from 'react-dom';
import { Key, VALUE_WRAP_CLASS } from '../const';
import LofiSelectPanel, { ILofiSelectPanelHandler } from '../LofiSelectPanel';
import { IMentionDataSourceAtom, ISelectableTagProps } from '../types';
import { setSelectionAfterTarget } from '../utils';
import './index.less';

const SelectableTag: FC<ISelectableTagProps> = ({
  mentionAtom,
  lofiInputEle,
  onSelect,
  setLofiInputEditable,
  defaultValue,
}) => {
  const {
    classname,
    searchable,
    focusedItemClassname,
    panelWrapClassname,
    dataSource,
    mentionChar,
    placeholder,
    empty,
    showMentionCharBefore,
  } = mentionAtom;
  const tagContainerRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>();
  const selectPanelRef = useRef<ILofiSelectPanelHandler>(null);
  const [curSelect, setCurSelect] = useState<
    IMentionDataSourceAtom | undefined
  >(defaultValue);
  const [tagEditable, setTagEditable] = useState<boolean>(false);

  const setCurTagEditable = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    if (searchable) {
      setLofiInputEditable?.(false);
      setTagEditable(true);

      const selectionObj = window.getSelection();
      selectionObj?.removeAllRanges();
      const rangeObj = document.createRange();
      rangeObj?.selectNodeContents(tagEle);
      selectionObj?.addRange(rangeObj);
    }

    setTimeout(() => {
      if (searchable) tagEle?.focus();
    });
  };

  const resetSelectionToInput = () => {
    const tagEle = tagContainerRef.current;
    if (tagEle) {
      setSelectionAfterTarget(tagEle, lofiInputEle);
    }
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

    setTimeout(() => {
      onSelect?.();
    });
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

      render(
        <LofiSelectPanel
          focusedItemClassname={focusedItemClassname}
          wrapClassname={panelWrapClassname}
          ref={selectPanelRef}
          options={dataSource?.data}
          onValueChange={handleValueChange}
          empty={empty}
        />,
        dropdownRef.current,
      );
    }

    const { height: inputHeight, left: inputLeft } =
      lofiInputEle.getBoundingClientRect();
    const { left: tagLeft } = tagEle.getBoundingClientRect();
    dropdownRef.current.style.top = inputHeight + 'px';
    dropdownRef.current.style.left = tagLeft - inputLeft + 'px';

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
      setCurTagEditable();
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

      if (!defaultValue) openDropdown();

      setTimeout(() => {
        if (!defaultValue) setCurTagEditable();

        if (defaultValue) window.getSelection()?.getRangeAt(0).collapse(false);
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
      className={classNames('selectable-tag', VALUE_WRAP_CLASS, classname, {
        'selectable-tag-show-mention': showMentionCharBefore,
      })}
      contentEditable={tagEditable}
      data-mention={mentionChar}
      data-placeholder={placeholder}
      data-value={curSelect?.value}
      data-label={curSelect?.label}
    >
      {curSelect?.label}
    </span>
  );
};

export default SelectableTag;
