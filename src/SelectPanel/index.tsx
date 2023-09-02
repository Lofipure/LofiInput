import classNames from 'classnames';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Key } from '../const';
import { IMentionDataSourceAtom, MentionValueType } from '../types';
import { findNextOption, findPreviousOption, isOverflow } from './help';
import './index.less';

interface ISelectPanleProps {
  focusedItemClassname?: string;
  wrapClassname?: string;
  options?: IMentionDataSourceAtom[];
  empty?: ReactNode;
  onValueChange?: (value: IMentionDataSourceAtom) => void;
}

export interface ISelectPanelHandler {
  setPanelOptions: (data: IMentionDataSourceAtom[]) => void;
  setPanelValue: (value?: MentionValueType) => void;
  setPanelVisible: (visible: boolean) => void;
  focusPanel: () => void;
  tranformKeyboardEvent: (ev: KeyboardEvent) => void;
  triggerSearch: (searchValue?: string) => void;
}

const SelectPanel = forwardRef<ISelectPanelHandler, ISelectPanleProps>(
  (props, ref) => {
    const {
      options: dataSource,
      focusedItemClassname,
      wrapClassname,
      empty,
      onValueChange,
    } = props;
    const [options, setOptions] = useState<IMentionDataSourceAtom[]>(
      dataSource ?? [],
    );
    const [value, setValue] = useState<MentionValueType>();
    const [visible, setVisible] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>();
    const listRef = useRef<HTMLDivElement>(null);
    const curSelectedValue = useRef<MentionValueType>();

    const initOptionSelect = (): Element | null => {
      const listEle = listRef.current;
      if (!listEle) return null;

      const optionList = listEle.querySelectorAll('[role="option"]');
      const currentItem =
        listEle.querySelector(`[data-value='${curSelectedValue.current}']`) ||
        optionList[0];

      if (!currentItem) return null;

      currentItem.setAttribute('aria-selected', 'true');
      if (focusedItemClassname) currentItem.classList.add(focusedItemClassname);

      return currentItem;
    };

    const setPanelVisible = (visible: boolean) => {
      setVisible(visible);
    };

    const setPanelOptions: ISelectPanelHandler['setPanelOptions'] = (data) => {
      setOptions(data);
    };

    const setPanelValue: ISelectPanelHandler['setPanelValue'] = (value) => {
      curSelectedValue.current = value;
      setValue(value);
      initOptionSelect();
    };

    const setFocusedOption = (currentItem: Element, option: Element) => {
      currentItem.removeAttribute('aria-selected');
      option.setAttribute('aria-selected', 'true');
      if (focusedItemClassname) {
        currentItem.classList.remove(focusedItemClassname);
        option.classList.add(focusedItemClassname);
      }
      curSelectedValue.current = String(
        option.getAttribute('data-value') ?? '',
      );
    };

    const handleListMouseMove = (ev: MouseEvent) => {
      const listEle = listRef.current;
      if (!listEle) return;

      const currentItem = initOptionSelect();
      const optionList = listEle.querySelectorAll('[role="option"]');

      const selectedItem = Array.from(optionList).find((item) =>
        ev.composedPath().includes(item),
      );

      if (!selectedItem || !currentItem) return;
      setFocusedOption(currentItem, selectedItem);
    };

    const handleListKeyDown = (ev: KeyboardEvent) => {
      const listEle = listRef.current;
      if (!listEle) return;

      const currentItem = initOptionSelect();
      const optionList = listEle.querySelectorAll('[role="option"]');

      if (!currentItem) return;

      const { code } = ev;
      ev.preventDefault();
      switch (code) {
        case Key.Down: {
          const nextOption = findNextOption(optionList, currentItem);
          if (nextOption) {
            setFocusedOption(currentItem, nextOption);
            if (nextOption?.parentElement && isOverflow(nextOption)) {
              nextOption.parentElement.scrollTop +=
                nextOption.getBoundingClientRect().height;
            }
          }
          break;
        }
        case Key.Up: {
          const previoutOption = findPreviousOption(optionList, currentItem);
          if (previoutOption) {
            setFocusedOption(currentItem, previoutOption);
            if (previoutOption?.parentElement && isOverflow(previoutOption)) {
              previoutOption.parentElement.scrollTop -=
                previoutOption.getBoundingClientRect().height;
            }
          }
          break;
        }
        case Key.Enter: {
          ev.preventDefault();
          const { label, value } = (currentItem as HTMLDivElement).dataset;
          onValueChange?.({ label: label ?? '', value: value ?? '' });
          break;
        }
      }
    };

    const renderOptions = useMemo<IMentionDataSourceAtom[]>(() => {
      if (!searchValue?.length) return options;
      return options.filter((item) => item.label.includes(searchValue));
    }, [searchValue, options]);

    useEffect(() => {
      const listEle = listRef.current;
      if (!listEle) return;

      listEle.addEventListener('keydown', handleListKeyDown);
      listEle.addEventListener('mousemove', handleListMouseMove);
      listEle.focus({
        preventScroll: true,
      });

      initOptionSelect();

      return () => {
        listEle.removeEventListener('keydown', handleListKeyDown);
        listEle.removeEventListener('mousemove', handleListMouseMove);
      };
    }, [visible]);

    useImperativeHandle(ref, () => ({
      setPanelOptions,
      setPanelValue,
      setPanelVisible,
      focusPanel: () => {
        listRef.current?.focus({
          preventScroll: true,
        });
      },
      tranformKeyboardEvent: handleListKeyDown,
      triggerSearch: setSearchValue,
    }));

    return (
      <div
        className={classNames('select-panel', wrapClassname)}
        role="listbox"
        ref={listRef}
        tabIndex={0}
      >
        {renderOptions?.length
          ? renderOptions.map((item) => (
              <div
                className={classNames('select-panel__item', {
                  'select-panel__item-active': value === item.value,
                })}
                key={item.value}
                data-value={item.value}
                data-label={item.label}
                role="option"
                onClick={() => onValueChange?.(item)}
              >
                {item.label}
              </div>
            ))
          : empty ?? '暂无数据'}
      </div>
    );
  },
);

export default SelectPanel;
