export type LofiInputValue = any;

export interface ILofiInputProps {
  classname?: string;
  mentionList: Array<IMentionAtom>;
}

export interface ILofiInputHandler {
  getValue?: () => LofiInputValue;
}

export interface IMentionAtom {
  mentionChar: string;
  classname?: string;
  mode: "editable" | "selectable"
  placeholder?: string
}