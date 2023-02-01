import { ReactNode } from 'react';

// type SelectableTagSetValueType = (item: IDisplayAtom) => Promise<void>;

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
  onSearch?: (searchValue: string, list: IDisplayAtom[]) => IDisplayAtom[];
  // renderDropdown?: (
  //   setValue: SelectableTagSetValueType,
  //   containerEle: HTMLElement,
  // ) => JSX.Element;
}

export interface IEditableTagProps {
  lofiInputEle: HTMLDivElement;
  mentionAtom: IMentionAtom;
  setLofiInputEditable?: (editable: boolean) => void;
}

export interface ISelectableTagProps {
  mentionAtom: IMentionAtom;
  lofiInputEle: HTMLDivElement;
}

export interface IDisplayAtom {
  label: ReactNode;
  value: string;
}
