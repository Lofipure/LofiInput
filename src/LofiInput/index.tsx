import classnames from 'classnames';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { excludeKeys, NodeType } from './const';
import './index.less';
import { ILofiInputHandler, ILofiInputProps, LofiInputValue } from './types';
import { renderEditableMentionTag, renderSelectableMentionTag } from './utils';

const LofiInput = forwardRef<ILofiInputHandler, ILofiInputProps>(
  (props, ref) => {
    const { classname, mentionList, placeholder, wrapClassname, onChange } =
      props;
    const [editable, setEditable] = useState<boolean>(true);

    const inputRef = useRef<HTMLDivElement>(null);

    const setLofiInputEditable = (editable: boolean) => {
      setEditable(editable);
    };

    const getValue = () => {
      const children = inputRef.current?.childNodes?.length
        ? Array.from(inputRef.current.childNodes)
        : [];
      if (!children?.length) return [];

      return children.reduce<LofiInputValue>((resultList, curNode) => {
        if (curNode.nodeType === NodeType.ElementNode) {
          const dataset = Object((curNode as HTMLSpanElement).dataset);
          if (dataset)
            resultList.push({
              label: dataset?.label ?? dataset?.value,
              value: dataset?.value,
              mention: dataset?.mention,
              isText: false,
            });
        } else if (curNode.nodeType === NodeType.TextNode) {
          (curNode.nodeValue?.toString() ?? '').split('').forEach((char) => {
            resultList.push({
              label: char,
              value: char,
              isText: true,
            });
          });
        }
        return resultList;
      }, []);
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

    useEffect(() => {
      const inputEle = inputRef.current;
      if (!inputEle) return;

      inputEle.addEventListener('keydown', handleKeyDown);
    }, []);

    useImperativeHandle(ref, () => ({
      getValue,
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
