import React from 'react';
import { render } from 'react-dom';
import EditableTag from './EditableTag';
import SelectableTag from './SelectableTag';
import { IMentionAtom } from './types';

export const renderEditableMentionTag = (param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  setLofiInputEditable?: (editable: boolean) => void;
}) => {
  const { lofiInputEle, mention, setLofiInputEditable } = param;
  const depEle = document.createElement('span');
  render(
    <EditableTag
      lofiInputEle={lofiInputEle}
      mentionAtom={mention}
      setLofiInputEditable={setLofiInputEditable}
    />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle.childNodes[0]);
};

export const renderSelectableMentionTag = (param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
}) => {
  const { mention, lofiInputEle } = param;
  const depEle = document.createElement('span');
  render(
    <SelectableTag mentionAtom={mention} lofiInputEle={lofiInputEle} />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle.childNodes[0]);
};

export const handleKeyDown = (
  lofiInputEle: HTMLDivElement,
  ev: KeyboardEvent,
  mentionList: IMentionAtom[],
  setLofiInputEditable: (editable: boolean) => void,
) => {
  const { key } = ev;
  const mentionItem = mentionList?.find((item) => item.mentionChar === key);

  if (mentionItem) {
    ev.preventDefault();
    if (mentionItem.mode === 'editable') {
      renderEditableMentionTag({
        lofiInputEle,
        mention: mentionItem,
        setLofiInputEditable,
      });
    } else {
      renderSelectableMentionTag({
        lofiInputEle,
        mention: mentionItem,
      });
    }

    return;
  }
};
