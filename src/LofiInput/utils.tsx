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
  depEle.setAttribute('contenteditable', 'false');
  render(
    <EditableTag
      lofiInputEle={lofiInputEle}
      mentionAtom={mention}
      setLofiInputEditable={setLofiInputEditable}
    />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle);
};

export const renderSelectableMentionTag = (param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onChange?: () => void;
}) => {
  const { mention, lofiInputEle, setLofiInputEditable, onChange } = param;
  const depEle = document.createElement('span');
  depEle.setAttribute('contenteditable', 'false');
  render(
    <SelectableTag
      mentionAtom={mention}
      lofiInputEle={lofiInputEle}
      setLofiInputEditable={setLofiInputEditable}
      onSelect={onChange}
    />,
    depEle,
  );

  const selectionObj = window.getSelection();
  selectionObj?.getRangeAt(0).insertNode(depEle);
};
