export enum Key {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Enter = 'Enter',
  Space = 'Space',
  Shift = 'Shift',
  Alt = 'Alt',
  Ctrl = 'Control',
  Meta = 'Meta',
}

export enum NodeType {
  ElementNode = 1,
  TextNode = 3,
}

export const excludeKeys = [
  Key.Space,
  Key.Shift,
  Key.Alt,
  Key.Ctrl,
  Key.Meta,
  Key.Down,
  Key.Up,
];
