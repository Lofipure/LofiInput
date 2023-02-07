import classnames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { disabledKeys, excludeKeys, NodeType, VALUE_WRAP_CLASS } from './const';
import './index.less';
import { ILofiInputHandler, ILofiInputProps, LofiInputValue } from './types';
import { renderEditableMentionTag, renderSelectableMentionTag } from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const {
      classname,
      mentionList,
      placeholder,
      wrapClassname,
      onChange,
      onBlur,
    } = props;
    const [editable, setEditable] = useState<boolean>(true);
    const inputRef = useRef<HTMLDivElement>(null);

    const getValue: ILofiInputHandler['getValue'] = () =>
      Array.from(inputRef.current?.childNodes ?? [])?.reduce<LofiInputValue>(
        (resultList, curNode, index) => {
          if (
            curNode.nodeType === NodeType.ElementNode &&
            curNode.nodeName === 'SPAN'
          ) {
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
                positionPin: {
                  offset: index + 1,
                },
              });
          } else if (curNode.nodeType === NodeType.TextNode) {
            (curNode.nodeValue?.toString() ?? '')
              .trim()
              .split('')
              .forEach((char, charIdx) => {
                resultList.push({
                  label: char,
                  value: char,
                  isText: true,
                  positionPin: {
                    node: curNode,
                    offset: charIdx + 1,
                  },
                });
              });
          }
          return resultList;
        },
        [],
      );

    const handleValueChange = () => {
      onChange?.(getValue());
    };

    const setLofiInputEditable = (editable: boolean) => {
      setEditable(editable);
    };

    const insertMentionTag: ILofiInputHandler['insertMentionTag'] = (
      dataAtom,
    ) => {
      const inputEle = inputRef.current;
      const { mentionChar, label, value } = dataAtom;
      const mentionConfig = mentionList.find(
        (item) => item.mentionChar === mentionChar,
      );
      if (!mentionConfig || !inputEle) return false;

      if (mentionConfig.mode === 'selectable')
        renderSelectableMentionTag({
          lofiInputEle: inputEle,
          mention: mentionConfig,
          setLofiInputEditable,
          onChange: handleValueChange,
          defaultValue: {
            mentionChar,
            label,
            value,
          },
        });
      else
        renderEditableMentionTag({
          lofiInputEle: inputEle,
          mention: mentionConfig,
          setLofiInputEditable,
          defaultValue: {
            mentionChar,
            label,
            value,
          },
        });

      setTimeout(() => {
        handleValueChange();
      });

      return true;
    };

    const insertTextNode: ILofiInputHandler['insertTextNode'] = (value) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.focus();

      const rangeObj = window.getSelection()?.getRangeAt(0);
      rangeObj?.insertNode(document.createTextNode(value));

      rangeObj?.collapse(false);

      setTimeout(() => {
        handleValueChange();
      });
    };

    const focusAt: ILofiInputHandler['focusAt'] = (positionPin) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;
      inputEle.focus();

      setTimeout(() => {
        if (positionPin) {
          const selection = window.getSelection();
          const rangeObj = selection?.getRangeAt(0);

          rangeObj?.setStart(positionPin?.node ?? inputEle, positionPin.offset);
        }
      });
    };

    const setValue: ILofiInputHandler['setValue'] = (value) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.innerHTML = '';

      inputEle.focus();

      const rangeObj = window.getSelection()?.getRangeAt(0);

      for (let i = 0; i < value?.length; ++i) {
        const valueAtom = value[i];
        if (valueAtom?.isText) {
          rangeObj?.insertNode(document.createTextNode(valueAtom.value));
        } else {
          const mentionConfig = mentionList.find(
            (item) => item.mentionChar === valueAtom.mention,
          );
          if (!mentionConfig) continue;

          if (mentionConfig?.mode === 'editable') {
            renderEditableMentionTag({
              lofiInputEle: inputEle,
              mention: mentionConfig,
              setLofiInputEditable,
              defaultValue: {
                mentionChar: mentionConfig.mentionChar,
                label: valueAtom.label,
                value: valueAtom.value,
              },
            });
          } else {
            renderSelectableMentionTag({
              lofiInputEle: inputEle,
              mention: mentionConfig,
              setLofiInputEditable,
              onChange: handleValueChange,
              defaultValue: {
                mentionChar: mentionConfig.mentionChar,
                label: valueAtom.label,
                value: valueAtom.value,
              },
            });
          }
        }
        rangeObj?.selectNodeContents(inputEle);
        rangeObj?.collapse(false);
      }

      setTimeout(() => {
        handleValueChange();
      });
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      if (disabledKeys.includes(ev.code as any)) {
        ev.preventDefault();
      }
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
          });
        else
          renderSelectableMentionTag({
            lofiInputEle: inputEle,
            mention: mentionItem,
            setLofiInputEditable,
            onChange: handleValueChange,
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
        });
      }
    };

    const handleBlur = () => {
      const selectionObj = window.getSelection();
      const rangeObj = selectionObj?.getRangeAt(0);
      const { startContainer, startOffset } = rangeObj || {};
      if (startOffset === undefined) return;
      onBlur?.({
        offset: startOffset,
        node: startContainer,
      });
    };

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', handleKeyDown);

      inputEle.addEventListener('blur', handleBlur);
      return () => {
        inputEle.removeEventListener('keydown', handleKeyDown);
        inputEle.removeEventListener('blur', handleBlur);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getValue,
      setValue,
      focusAt,
      insertMentionTag,
      insertTextNode,
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
