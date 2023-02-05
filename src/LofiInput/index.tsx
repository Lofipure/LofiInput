import classnames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { excludeKeys, NodeType, VALUE_WRAP_CLASS } from './const';
import './index.less';
import { ILofiInputHandler, ILofiInputProps, LofiInputValue } from './types';
import {
  getLofiInputCurOffset,
  renderEditableMentionTag,
  renderSelectableMentionTag,
} from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const {
      classname,
      mentionList,
      placeholder,
      wrapClassname,
      onChange,
      onSelectionChange,
    } = props;
    const [editable, setEditable] = useState<boolean>(true);

    const inputRef = useRef<HTMLDivElement>(null);

    const handleSelectionChange: ILofiInputProps['onSelectionChange'] = (
      offset,
    ) => {
      onSelectionChange?.(offset);
    };

    const setLofiInputEditable = (editable: boolean) => {
      setEditable(editable);
    };

    const getValue: ILofiInputHandler['getValue'] = () =>
      Array.from(inputRef.current?.childNodes ?? [])?.reduce<LofiInputValue>(
        (resultList, curNode) => {
          if (curNode.nodeType === NodeType.ElementNode) {
            const dataset = Object(
              (
                (curNode as HTMLSpanElement).getElementsByClassName(
                  VALUE_WRAP_CLASS,
                )[0] as HTMLSpanElement
              ).dataset,
            );
            if (dataset)
              resultList.push({
                label: dataset?.label ?? dataset?.value,
                value: dataset?.value,
                mention: dataset?.mention,
                isText: false,
              });
          } else if (curNode.nodeType === NodeType.TextNode) {
            (curNode.nodeValue?.toString() ?? '')
              .trim()
              .split('')
              .forEach((char) => {
                resultList.push({
                  label: char,
                  value: char,
                  isText: true,
                });
              });
          }
          return resultList;
        },
        [],
      );

    const setValue: ILofiInputHandler['setValue'] = (value) => {
      // TODO set value
      console.log('[🔧 Debug 🔧]', 'set value', value);
    };

    const handleValueChange = () => {
      onChange?.(getValue());
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      const { key } = ev;
      const mentionItem = mentionList?.find((item) => item.mentionChar === key);

      if (mentionItem) {
        ev.preventDefault();
        if (mentionItem.mode === 'editable')
          renderEditableMentionTag({
            lofiInputEle: inputEle,
            mention: mentionItem,
            setLofiInputEditable,
            onSelectionChange: handleSelectionChange,
          });
        else
          renderSelectableMentionTag({
            lofiInputEle: inputEle,
            mention: mentionItem,
            setLofiInputEditable,
            onChange: handleValueChange,
            onSelectionChange: handleSelectionChange,
          });
      } else {
        setTimeout(() => {
          if (!excludeKeys.includes(ev.key as any)) {
            const focusNodeClass = Array.from(
              window.getSelection()?.focusNode?.parentElement?.classList ?? [],
            );
            if (
              !focusNodeClass.includes('editable-tag') &&
              !focusNodeClass.includes('selectable-tag')
            )
              handleValueChange();
          }

          const offset = getLofiInputCurOffset(inputEle);
          if (offset) handleSelectionChange(offset);
        });
      }
    };

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', handleKeyDown);
      return () => {
        inputEle.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getValue,
      setValue,
    }));

    return (
      <div className={classnames(wrapClassname, 'lofi-input-wrap')}>
        <div
          className={classnames(classname, 'lofi-input')}
          ref={inputRef}
          contentEditable={editable}
          data-placeholder={placeholder}
        ></div>
      </div>
    );
  },
);

export default LofiInput;
