import React from 'react';
import { render } from 'react-dom';
import { NodeType, VALUE_WRAP_CLASS } from './const';
import EditableTag from './EditableTag';
import SelectableTag from './SelectableTag';
import { ILofiInputProps, IMentionAtom, IMentionInsertAtom } from './types';

export const renderEditableMentionTag = (param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onSelectionChange?: ILofiInputProps['onSelectionChange'];
}) => {
  const {
    lofiInputEle,
    mention,
    defaultValue,
    setLofiInputEditable,
    onSelectionChange,
  } = param;
  const depEle = document.createElement('span');
  depEle.setAttribute('contenteditable', 'false');
  render(
    <EditableTag
      lofiInputEle={lofiInputEle}
      mentionAtom={mention}
      defaultValue={defaultValue}
      setLofiInputEditable={setLofiInputEditable}
      onSelectionChange={onSelectionChange}
    />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle);
};

export const renderSelectableMentionTag = (param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onChange?: () => void;
  onSelectionChange?: ILofiInputProps['onSelectionChange'];
}) => {
  const {
    mention,
    lofiInputEle,
    defaultValue,
    setLofiInputEditable,
    onChange,
    onSelectionChange,
  } = param;
  const depEle = document.createElement('span');
  depEle.setAttribute('contenteditable', 'false');
  render(
    <SelectableTag
      mentionAtom={mention}
      lofiInputEle={lofiInputEle}
      setLofiInputEditable={setLofiInputEditable}
      onSelect={onChange}
      onSelectionChange={onSelectionChange}
      defaultValue={defaultValue}
    />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle);
};

export const setSelectionAfterTarget = (
  targetEle: HTMLElement,
  lofiInputEle: HTMLDivElement,
): number => {
  lofiInputEle.focus();
  const selectionObj = window.getSelection();
  const rangeObj = selectionObj?.getRangeAt(0);
  rangeObj?.selectNodeContents(lofiInputEle);
  rangeObj?.collapse(true);

  const startOffset =
    Array.from(lofiInputEle.childNodes ?? []).findIndex((item) => {
      if (item.nodeType === NodeType.ElementNode) {
        const ele = (item as HTMLSpanElement).getElementsByClassName(
          VALUE_WRAP_CLASS,
        )[0];
        return ele === targetEle;
      }
      return false;
    }) + 1;

  rangeObj?.setStart(lofiInputEle, startOffset);

  return startOffset;
};

export const getLofiInputCurOffset = (
  lofiInputEle: HTMLDivElement,
): number | false => {
  const { startContainer, startOffset } =
    window.getSelection()?.getRangeAt(0) || {};
  if (startContainer === undefined || startOffset === undefined) return false;

  const childNodes = Array.from(lofiInputEle.childNodes ?? []).filter(
    (item) =>
      item.nodeType === NodeType.ElementNode || (item as Text).data?.length,
  );

  const { offset } = childNodes.reduce<{
    offset: number;
  }>(
    (result, item, index) => {
      const beforeExtraLen = childNodes
        .slice(0, index)
        .filter(
          (item) =>
            item.nodeType === NodeType.TextNode &&
            (item as Text).data?.length > 1,
        )
        .reduce<number>((len, cur) => len + (cur as Text).data?.length - 1, 0);

      if (item.nodeType === NodeType.ElementNode) {
        const ele = (item as HTMLSpanElement).getElementsByClassName(
          VALUE_WRAP_CLASS,
        )[0];
        if (ele === startContainer) {
          result.offset = index + 1 + beforeExtraLen;
        }
      } else {
        if (item === startContainer) {
          result.offset = index + startOffset + beforeExtraLen;
        }
      }

      return result;
    },
    {
      offset: 0,
    },
  );

  return offset;
};
