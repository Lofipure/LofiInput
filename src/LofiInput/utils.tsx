import React from 'react';
import { render } from 'react-dom';
import EditableTag from './EditableTag';
import SelectableTag from './SelectableTag';
import { IMentionAtom } from './types';

export function renderEditableMentionTag(param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  handleTagEdit?: () => void;
  handleChange?: () => void;
}) {
  const { lofiInputEle, mention, handleTagEdit, handleChange } = param;
  const depEle = document.createElement('span');
  render(
    <EditableTag
      mentionAtom={mention}
      showMentionChar
      onEdit={handleTagEdit}
      onChange={handleChange}
    />,
    depEle,
  );

  lofiInputEle.appendChild(depEle.childNodes[0]);
}

export function renderSelectableMentionTag(param: {
  lofiInputEle: HTMLDivElement;
  mention: IMentionAtom;
  handleTagEdit?: () => void;
  handleChange?: () => void;
}) {
  const { lofiInputEle, mention } = param;
  const depEle = document.createElement('span');
  render(<SelectableTag mentionAtom={mention} />, depEle);

  lofiInputEle.appendChild(depEle.childNodes[0]);
}

export function handleKeyDown(
  this: HTMLDivElement,
  ev: KeyboardEvent,
  mentionList: IMentionAtom[],
  handleTagEdit?: () => void,
  handleChange?: () => void,
) {
  const { key } = ev;
  const mentionItem = mentionList?.find((item) => item.mentionChar === key);

  if (mentionItem) {
    ev.preventDefault();
    if (mentionItem.mode === 'editable') {
      renderEditableMentionTag({
        lofiInputEle: this,
        mention: mentionItem,
        handleTagEdit,
        handleChange,
      });
    } else {
      renderSelectableMentionTag({
        lofiInputEle: this,
        mention: mentionItem,
        handleTagEdit,
        handleChange,
      });
    }

    return;
  }
}
