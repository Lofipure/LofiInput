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
  offset?: number;
}>;

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
  showMentionCharBefore?: boolean;
}

export interface ILofiInputProps {
  wrapClassname?: string;
  classname?: string;
  placeholder?: string;
  mentionList: Array<IMentionAtom>;
  disabledCharList?: Array<string | RegExp>;
  onChange?: (value: LofiInputValue) => void;
  onBlur?: (lastOffset: number) => void;
}

export interface ILofiInputHandler {
  getValue: () => LofiInputValue;
  setValue: (value: LofiInputValue) => void;
  focusAt: (offset: number) => void;
  insertMentionTag: (value: IMentionInsertAtom) => void;
  insertTextNode: (value: string) => void;
}

export interface ITagProps {
  inputEle: HTMLDivElement;
  mentionAtom: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onChange?: () => void;
}

export interface IDisplayAtom {
  label: ReactNode;
  value: string;
}

export interface IRenderTagParam {
  inputEle: HTMLDivElement;
  mention: IMentionAtom;
  defaultValue?: IMentionInsertAtom;
  setLofiInputEditable?: (editable: boolean) => void;
  onChange?: () => void;
}

export interface IValidateAtom {
  value: string;
  isCalcAtom?: boolean; // 是不是可计算的最小原子
}
