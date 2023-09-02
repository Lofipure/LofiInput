import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Key, VALUE_WRAP_CLASS } from '../const';
import SelectPanel, { ISelectPanelHandler } from '../SelectPanel';
import { IMentionDataSourceAtom, ITagProps } from '../types';
import { setSelectionAfterTarget } from '../utils';
import './index.less';

const SelectTag: FC<ITagProps> = ({
  mentionAtom,
  inputEle,
  defaultValue,
  onChange,
  setExpressionEditable,
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
  const selectPanelRef = useRef<ISelectPanelHandler>(null);
  const [curSelect, setCurSelect] = useState<
    IMentionDataSourceAtom | undefined
  >(defaultValue);
  const [tagEditable, setTagEditable] = useState<boolean>(false);

  const setCurTagEditable = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle) return;

    if (searchable) {
      setExpressionEditable?.(false);
      setTagEditable(true);

      const selectionObj = window.getSelection();
      selectionObj?.removeAllRanges();
      const rangeObj = document.createRange();
      rangeObj?.selectNodeContents(tagEle);
      selectionObj?.addRange(rangeObj);
    }

    setTimeout(() => {
      tagEle.focus();
    });
  };

  const resetSelectionToInput = () => {
    const tagEle = tagContainerRef?.current;
    if (tagEle) {
      setSelectionAfterTarget(tagEle, inputEle);
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
    if ([Key.Space].includes(ev.code as any)) {
      ev.preventDefault();
      closeDropdown();

      setExpressionEditable?.(true);
      setTagEditable(false);

      resetSelectionToInput();
      return;
    }
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

    setTimeout(() => {
      const searchValue = tagEle.innerText;
      selectPanelRef.current?.triggerSearch(searchValue);
    });
  };

  const handleValueChange = async (item: IMentionDataSourceAtom) => {
    setCurSelect(item);
    closeDropdown();

    if (searchable) {
      setExpressionEditable?.(true);
      setTagEditable(false);
    }

    setTimeout(() => {
      onChange?.();
    });

    selectPanelRef.current?.setPanelValue(item.value);
    resetSelectionToInput();
  };

  const openDropdown = () => {
    const tagEle = tagContainerRef.current;
    if (!tagEle || !mentionAtom?.dataSource) return;

    if (!dropdownRef.current) {
      const dropdownContent = document.createElement('div');
      dropdownContent.setAttribute('class', 'dropdown-container');
      dropdownRef.current = dropdownContent;

      render(
        <SelectPanel
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

    const { top: inputTop, left: inputLeft } = inputEle.getBoundingClientRect();

    const {
      left: tagLeft,
      height: tagHeight,
      top: tagTop,
    } = tagEle.getBoundingClientRect();
    dropdownRef.current.style.top = tagTop - inputTop + tagHeight + 6 + 'px';
    dropdownRef.current.style.left = tagLeft - inputLeft + 'px';

    dropdownRef.current.style.display = 'unset';
    selectPanelRef.current?.setPanelVisible(true);

    inputEle?.parentNode?.appendChild(dropdownRef.current);
  };

  const handleOutofTag = (ev: MouseEvent) => {
    if (!dropdownRef.current || !tagContainerRef.current) return;
    const path = ev.composedPath();

    if (
      !path.includes(dropdownRef.current) &&
      !path.includes(tagContainerRef.current)
    ) {
      closeDropdown();

      setExpressionEditable?.(true);
      setTagEditable(false);
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
      className={classNames('select-tag', VALUE_WRAP_CLASS, classname, {
        'select-tag-show-mention': showMentionCharBefore,
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

export default SelectTag;
