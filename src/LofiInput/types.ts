import { ReactNode } from 'react';

export type MentionValueType = number | string;

export interface IMentionInsertAtom {
  mentionChar: string;
  label: string;
  value: string;
}

export interface IMentionDataSourceAtom {
  label: string;
  value: MentionValueType;
  children?: IMentionDataSourceAtom[];
}

export type LofiInputValue = Array<{
  label: string;
  value: string;
  isText: boolean;
  mention?: string;
  positionPin?: IPinPosition;
}>;

export interface IPinPosition {
  offset: number;
  node?: Node;
}

export interface ILofiInputProps {
  wrapClassname?: string;
  classname?: string;
  placeholder?: string;
  mentionList: Array<IMentionAtom>;
  onChange?: (value: LofiInputValue) => void;
  onSelectionChange?: (offset: number) => void;
  onBlur?: (positionPin: IPinPosition) => void;
}

export interface ILofiInputHandler {
  getValue: () => LofiInputValue;
  setValue: (value: LofiInputValue) => void;
  focusAt: (positionPin?: IPinPosition) => void;
  insertMentionTag: (value: IMentionInsertAtom) => boolean;
}

export interface IMentionAtom {
  mentionChar: string;
  classname?: string;
  mode: 'editable' | 'selectable';
  placeholder?: string;

  // * [selectable tag]
  searchable?: boolean;
  dataSource?: {
    type: 'select';
    data: Array<IMentionDataSourceAtom>;
  };
  focusedItemClassname?: string;
  panelWrapClassname?: string;
  empty?: ReactNode;
}

export interface IEditableTagProps {
  lofiInputEle: HTMLDivElement;
  mentionAtom: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onSelectionChange?: (offset: number) => void;
}

export interface ISelectableTagProps {
  lofiInputEle: HTMLDivElement;
  mentionAtom: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onSelect?: () => void;
  onSelectionChange?: (offset: number) => void;
}

export interface IDisplayAtom {
  label: ReactNode;
  value: string;
}
