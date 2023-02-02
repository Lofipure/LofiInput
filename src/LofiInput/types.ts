import { ReactNode } from 'react';

export type MentionValueType = number | string;

export interface IMentionDataSourceAtom {
  label: string;
  value: MentionValueType;
  children?: IMentionDataSourceAtom[];
}

export type LofiInputValue = any;

export interface ILofiInputProps {
  wrapClassname?: string;
  classname?: string;
  placeholder?: string;
  mentionList: Array<IMentionAtom>;
}

export interface ILofiInputHandler {
  getValue?: () => LofiInputValue;
}

export interface IMentionAtom {
  mentionChar: string;
  classname?: string;
  mode: 'editable' | 'selectable';
  placeholder?: string;

  // * [selectable tag]
  searchable?: boolean;
  dataSource?: {
    type: 'select' | 'cascader';
    data: Array<IMentionDataSourceAtom>;
  };
  focusedItemClassname?: string;
  panelWrapClassname?: string;
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
}

export interface IDisplayAtom {
  label: ReactNode;
  value: string;
}
