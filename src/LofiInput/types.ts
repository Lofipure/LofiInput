import { ReactNode } from 'react';

export type MentionValueType = number | string;

export interface IMentionDataSourceAtom {
  label: string;
  value: MentionValueType;
  children?: IMentionDataSourceAtom[];
}

export type LofiInputValue = Array<{
  label: string;
  value: string;
  mention?: string;
  isText: boolean;
}>;

export interface ILofiInputProps {
  wrapClassname?: string;
  classname?: string;
  placeholder?: string;
  mentionList: Array<IMentionAtom>;
  onChange?: (value: LofiInputValue) => void;
}

export interface ILofiInputHandler {
  getValue: () => LofiInputValue;
  setValue: (value: LofiInputValue) => void;
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
  setLofiInputEditable?: (editable: boolean) => void;
}

export interface ISelectableTagProps {
  mentionAtom: IMentionAtom;
  lofiInputEle: HTMLDivElement;
  setLofiInputEditable?: (editable: boolean) => void;
  onSelect?: () => void;
}

export interface IDisplayAtom {
  label: ReactNode;
  value: string;
}
