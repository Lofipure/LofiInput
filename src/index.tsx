import classNames from 'classnames';
import React, {
  ClipboardEvent,
  CompositionEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { CLIPBOARD_KEY, excludeKeys } from './const';
import './index.less';
import {
  ILofiInputHandler,
  ILofiInputProps,
  IMentionAtom,
  LofiInputValue,
} from './types';
import {
  getInputEleValue,
  getOffsetAtInputEle,
  handleCompositionEnd as __handleCompositionEnd,
  handleKeyDown as __handleKeyDown,
  renderMentionTag,
  renderTextNodes,
  renderValue,
} from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const {
      wrapClassname,
      classname,
      placeholder,
      mentionList,
      disabledCharList = [],
      onChange,
      onBlur,
    } = props;
    const [editable, setEditable] = useState<boolean>(true);
    const inputRef = useRef<HTMLDivElement>(null);
    const mentionListRef = useRef<IMentionAtom[]>(mentionList || []);
    const [lastOffset, setLastOffset] = useState<number>(0);

    const setLofiInputEditable = (editable: boolean) => {
      setEditable(editable);
    };

    const getValue: ILofiInputHandler['getValue'] = () =>
      getInputEleValue(inputRef.current);

    const handleValueChange = () => {
      onChange?.(getValue());
    };

    const triggerValueChange = (key: string) => {
      setTimeout(() => {
        const selection = window.getSelection();
        const { focusNode } = selection || {};
        if (!excludeKeys.includes(key as any)) {
          const focusNodeClass = Array.from(
            focusNode?.parentElement?.classList ?? [],
          );
          if (
            !focusNodeClass.includes('edit-tag') &&
            !focusNodeClass.includes('select-tag')
          ) {
            handleValueChange();
          }
        }
      });
    };

    const setValue: ILofiInputHandler['setValue'] = (value) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.innerHTML = '';

      inputEle.focus();

      renderValue(value, mentionListRef.current, {
        inputEle,
        setLofiInputEditable,
        onChange: handleValueChange,
      });

      setTimeout(() => {
        handleValueChange();
      });
    };

    const insertMentionTag: ILofiInputHandler['insertMentionTag'] = (
      dataAtom,
    ) => {
      const inputEle = inputRef.current;
      const { mentionChar, label, value } = dataAtom;
      const mentionConfig = mentionListRef.current.find(
        (item) => item.mentionChar === mentionChar,
      );
      if (!mentionConfig || !inputEle) return;

      inputEle.focus();
      const selection = window.getSelection();
      const rangeObj = selection?.getRangeAt(0);

      rangeObj?.setStart(inputEle, lastOffset);

      renderMentionTag({
        inputEle,
        mention: mentionConfig,
        setLofiInputEditable,
        onChange: handleValueChange,
        defaultValue: {
          mentionChar,
          label,
          value,
        },
      });

      setTimeout(() => {
        handleValueChange();
      });

      return;
    };

    const insertTextNode: ILofiInputHandler['insertTextNode'] = (value) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.focus();
      const selection = window.getSelection();
      const rangeObj = selection?.getRangeAt(0);

      rangeObj?.setStart(inputEle, lastOffset);

      renderTextNodes(value);

      setTimeout(() => {
        handleValueChange();
      });
    };

    const focusAt: ILofiInputHandler['focusAt'] = (offset) => {
      const inputEle = inputRef.current;
      if (!inputEle) return;
      inputEle.focus();

      if (offset) {
        const selection = window.getSelection();
        const rangeObj = selection?.getRangeAt(0);

        rangeObj?.setStart(inputEle, offset);
      }
    };

    const handleBlur = () => {
      const selectionObj = window.getSelection();
      const rangeObj = selectionObj?.getRangeAt(0);

      const { startOffset } = rangeObj || {};
      if (startOffset === undefined) return;

      setLastOffset(startOffset);
      onBlur?.(startOffset);
    };

    const handleCompositionEnd = (ev: CompositionEvent<HTMLDivElement>) => {
      const inputEle = inputRef.current;
      ev.target.dispatchEvent(new window.InputEvent('input'));
      if (!inputEle) return;
      __handleCompositionEnd({
        inputEle,
        ev,
        triggerValueChange,
      });
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      const inputEle = inputRef.current;
      if (!inputEle) {
        ev.preventDefault();
        return;
      }
      __handleKeyDown({
        inputEle,
        ev,
        mentionList: mentionListRef.current,
        disabledCharList,
        triggerValueChange,
        renderMentionTag: (mention) =>
          renderMentionTag({
            mention,
            onChange: handleValueChange,
            inputEle,
            setLofiInputEditable,
          }),
      });
    };

    const handleCopyOrCut = (
      ev: ClipboardEvent<HTMLDivElement>,
      isCut = false,
    ) => {
      ev.preventDefault();
      const rangeObj = window.getSelection()?.getRangeAt(0);
      if (!rangeObj) return;

      const inputEle = inputRef.current;
      if (!inputEle) return;

      const { startContainer, endContainer } = rangeObj;

      const startOffset =
          inputEle === startContainer
            ? rangeObj.startOffset
            : getOffsetAtInputEle(inputEle, startContainer),
        endOffset =
          inputEle === endContainer
            ? rangeObj.endOffset
            : getOffsetAtInputEle(inputEle, endContainer);

      const copyedValue = getValue().slice(startOffset, endOffset);
      ev.clipboardData.setData(
        'text/plain',
        JSON.stringify({ [CLIPBOARD_KEY]: copyedValue }),
      );

      if (isCut) {
        rangeObj.deleteContents();
        setTimeout(() => {
          handleValueChange();
        });
      }
    };

    const handlePaste = async (ev: ClipboardEvent<HTMLDivElement>) => {
      ev.preventDefault();
      const inputEle = inputRef.current;
      if (!inputEle) return;

      const data: LofiInputValue = await new Promise<LofiInputValue>(
        (resolve) => {
          try {
            resolve(
              JSON.parse(ev.clipboardData.getData('text/plain'))?.[
                CLIPBOARD_KEY
              ] ?? [],
            );
          } catch (e) {
            const text = ev.clipboardData.getData('text/plain');
            resolve(
              Array.from(text).map<LofiInputValue[number]>((item) => ({
                label: item,
                value: item,
                isText: true,
              })),
            );
          }
        },
      );

      renderValue(data, mentionListRef.current, {
        inputEle: inputEle,
        setLofiInputEditable,
        onChange: handleValueChange,
      });

      setTimeout(() => {
        handleValueChange();
      });
    };

    useEffect(() => {
      mentionListRef.current = mentionList;
    }, [mentionList]);

    useImperativeHandle(ref, () => ({
      getValue,
      setValue,
      focusAt,
      insertMentionTag,
      insertTextNode,
    }));

    return (
      <div className={classNames('lofi-input-wrap', wrapClassname)}>
        <div
          className={classNames('lofi-input', classname)}
          ref={inputRef}
          contentEditable={editable}
          data-placeholder={placeholder}
          onCompositionEnd={handleCompositionEnd}
          onCut={(ev) => handleCopyOrCut(ev, true)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onCopy={handleCopyOrCut}
        ></div>
      </div>
    );
  },
);

export default LofiInput;
