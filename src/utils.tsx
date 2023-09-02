import React, { CompositionEvent, KeyboardEvent } from 'react';
import { render } from 'react-dom';
import {
  DEP_SPAN_CLASS,
  disabledKeys,
  Key,
  NodeType,
  VALUE_WRAP_CLASS,
} from './const';
import EditTag from './EditTag';
import SelectTag from './SelectTag';
import {
  IMentionAtom,
  IRenderTagParam,
  IValidateAtom,
  LofiInputValue,
} from './types';

const BUFFER_KEY = 229;

export const isFuncKeyDown = (ev: KeyboardEvent) =>
  [ev.altKey, ev.ctrlKey, ev.metaKey].some((item) => item);

export const getOffsetAtInputEle = (inputEle: HTMLDivElement, ele: Node) => {
  const benchEle = ele.nodeType === NodeType.TextNode ? ele.parentNode : ele;
  return (
    Array.from(inputEle.childNodes).findIndex((item) => item === benchEle) + 1
  );
};

export const setSelectionAfterTarget = (
  targetEle: HTMLElement,
  inputEle: HTMLDivElement,
): number => {
  inputEle.focus();
  const selectionObj = window.getSelection();
  const rangeObj = selectionObj?.getRangeAt(0);

  rangeObj?.selectNodeContents(inputEle);
  rangeObj?.collapse(true);

  const startOffset = Array.from(inputEle.childNodes ?? []).findIndex(
    (item) => {
      if (item.nodeType === NodeType.ElementNode) {
        const ele = (item as HTMLSpanElement).getElementsByClassName(
          VALUE_WRAP_CLASS,
        )[0];
        return ele === targetEle;
      }
      return false;
    },
  );

  rangeObj?.setStart(inputEle, startOffset + 1);

  return startOffset;
};

export const renderMentionTag = (param: IRenderTagParam) => {
  const { mention } = param;
  const depEle = document.createElement('span');
  depEle.setAttribute('contenteditable', 'false');
  depEle.setAttribute('data-text', '0');
  depEle.className = DEP_SPAN_CLASS;

  const TagRenderComp = mention.mode === 'editable' ? EditTag : SelectTag;
  render(<TagRenderComp {...param} mentionAtom={mention} />, depEle);

  window.getSelection()?.getRangeAt(0).insertNode(depEle);
};

export const renderTextNodes = (text: string) => {
  const curRange = window.getSelection()?.getRangeAt(0);
  if (!curRange) return;
  for (let i = 0; i < text.length; ++i) {
    const char = text[i];

    const spanEle = document.createElement('span');
    spanEle.setAttribute('contenteditable', 'false');
    spanEle.textContent = char;
    spanEle.setAttribute('data-text', '1');
    spanEle.setAttribute('data-is-space', (text === ' ' ? 1 : 0).toString());

    curRange.insertNode(spanEle);
    curRange.collapse();
  }
};

export const setNumberRangeAt = (num: number, range: [number, number]) => {
  const [min, max] = range;
  return Math.min(max, Math.max(min, num));
};

export const handleKeyDown = (param: {
  inputEle: HTMLDivElement;
  ev: KeyboardEvent;
  mentionList: IMentionAtom[];
  disabledCharList: Array<string | RegExp>;
  renderMentionTag: (mention: IMentionAtom) => void;
  triggerValueChange: (key: string) => void;
}) => {
  const {
    inputEle,
    ev,
    mentionList,
    disabledCharList,
    renderMentionTag,
    triggerValueChange,
  } = param;

  const { key } = ev;
  const selection = window.getSelection();
  const { focusNode, focusOffset } = selection || {};
  const range = selection?.getRangeAt(0);

  if (ev.keyCode === BUFFER_KEY) {
    return;
  }
  if (disabledKeys.includes(key as any)) {
    ev.preventDefault();
  }

  if ([Key.Delete, Key.Backspace].includes(key as any)) {
    if (focusNode === inputEle && focusOffset !== undefined && range) {
      ev.preventDefault();
      if (range.startOffset === range.endOffset) {
        const startOffset = setNumberRangeAt(focusOffset - 1, [
            0,
            inputEle.childNodes.length,
          ]),
          endOffset = setNumberRangeAt(focusOffset, [
            0,
            inputEle.childNodes.length,
          ]);
        range.setStart(inputEle, startOffset);
        range.setEnd(inputEle, endOffset);
      } else {
        range.setStart(inputEle, range.startOffset);
        range.setEnd(inputEle, range.endOffset);
      }
      range.deleteContents();

      triggerValueChange(key);
    } else if (
      Array.from(inputEle.childNodes).find((child) => child === focusNode) &&
      range
    ) {
      ev.preventDefault();
      const { startContainer, endContainer } = range;
      const startOffset =
        startContainer !== inputEle
          ? getOffsetAtInputEle(inputEle, startContainer) - 1
          : range.startOffset;
      const endOffset =
        endContainer !== inputEle
          ? getOffsetAtInputEle(inputEle, endContainer)
          : range.endOffset;
      range.setStart(inputEle, startOffset);
      range.setEnd(inputEle, endOffset);
      range.deleteContents();
      triggerValueChange(key);
    }
  }

  if ([Key.Left, Key.Right].includes(key as any)) {
    if (focusNode === inputEle && focusOffset !== undefined && range) {
      ev.preventDefault();
      const offset = setNumberRangeAt(
        focusOffset + (key === Key.Left ? -1 : 1),
        [0, inputEle.childNodes?.length],
      );
      range.setStart(inputEle, offset);
      range.collapse(true);
    }
  }

  const mention = mentionList.find((item) => item.mentionChar === key);

  if (mention) {
    const focusNode = window.getSelection()?.focusNode;
    if (focusNode === inputEle) {
      ev.preventDefault();
      renderMentionTag(mention);
    }
    return;
  } else {
    if (key?.length === 1 && focusNode === inputEle && !isFuncKeyDown(ev)) {
      ev.preventDefault();
      const result = disabledCharList.some((item) =>
        typeof item === 'object'
          ? item.test(key)
          : String(item) === String(key),
      );
      if (!result) {
        renderTextNodes(key);
        triggerValueChange(key);
      }
    }
  }
};

export const handleCompositionEnd = (param: {
  ev: CompositionEvent<HTMLDivElement>;
  inputEle: HTMLDivElement;
  triggerValueChange: (key: string) => void;
}) => {
  const { ev, inputEle, triggerValueChange } = param;
  const data = ev?.data ?? '';

  Array.from(inputEle.childNodes)
    .filter((child) => child.nodeType === NodeType.TextNode)
    .forEach((child) => {
      child.remove();
    });

  Array.from(data).forEach((char) => renderTextNodes(char));

  triggerValueChange(data);
};

export const renderValue = (
  value: LofiInputValue,
  mentionList: IMentionAtom[],
  renderParam: Omit<IRenderTagParam, 'mention' | 'defaultValue'>,
) => {
  const range = window.getSelection()?.getRangeAt(0);

  for (let i = 0; i < value.length; ++i) {
    const valueAtom = value[i];
    if (valueAtom?.isText) {
      renderTextNodes(valueAtom.value);
    } else {
      const mentionConfig = mentionList.find(
        (item) => item.mentionChar === valueAtom.mention,
      );
      if (!mentionConfig) continue;
      renderMentionTag({
        ...renderParam,
        mention: mentionConfig,
        defaultValue: {
          mentionChar: mentionConfig.mentionChar,
          ...valueAtom,
        },
      });
    }
    range?.selectNodeContents(renderParam.inputEle);
    range?.collapse(false);
  }
};

export const getInputEleValue = (
  inputEle?: HTMLDivElement | null,
): LofiInputValue =>
  Array.from(inputEle?.childNodes ?? []).reduce<LofiInputValue>(
    (resultList, curNode, index) => {
      if (curNode.nodeType !== NodeType.ElementNode) return resultList;
      const isText = Number((curNode as HTMLSpanElement)?.dataset?.text);
      if (isText) {
        (curNode.textContent?.toString() ?? '').split('').forEach((char) => {
          resultList.push({
            label: char,
            value: char,
            isText: true,
            offset: index + 1,
          });
        });
      } else {
        const dataset = Object(
          (
            (curNode as HTMLSpanElement).getElementsByClassName(
              VALUE_WRAP_CLASS,
            )[0] as HTMLSpanElement
          )?.dataset ?? {},
        );
        resultList.push({
          label: dataset?.label ?? dataset?.value,
          value: dataset?.value,
          mention: dataset?.mention,
          isText: false,
          offset: index + 1,
        });
      }
      return resultList;
    },
    [],
  );

/**
 * 中缀表达式转换为逆波兰表达式
 * @param {IValidateAtom[]} infixExp 中缀表达式
 */
const infix2Postfix = (infixExp: IValidateAtom[]): IValidateAtom[] | false => {
  // 初始化操作符栈和后缀表达式栈
  const operatorStack: IValidateAtom[] = [];
  const postfixExp: IValidateAtom[] = [];

  const operations = ['+', '-', '*', '/'];
  // 定义操作符的优先级
  const priority: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  // 遍历中缀表达式的每个元素
  for (const atom of infixExp) {
    if (atom?.isCalcAtom) {
      // 如果当前元素是可计算原子，则将其加入后缀表达式栈中
      postfixExp.push(atom);
    } else {
      // 如果是左括号，则将其加入操作符栈中
      if (atom.value === '(') {
        operatorStack.push(atom);
      }
      // 如果是右括号，则将操作符栈中的元素弹出并加入到后缀表达式栈中，直到遇到左括号为止
      else if (atom?.value === ')') {
        while (operatorStack[operatorStack.length - 1]?.value !== '(') {
          if (!operatorStack?.length) {
            return false;
          }
          postfixExp.push(operatorStack.pop()!);
        }
        operatorStack.pop(); // 弹出左括号
      }
      // 如果是操作符，则将其与操作符栈顶的元素进行比较
      else if (operations.includes(atom.value)) {
        // 如果当前操作符优先级大于栈顶元素优先级，则将其加入操作符栈中
        while (
          priority[atom?.value] <=
          priority[operatorStack[operatorStack.length - 1]?.value]
        ) {
          postfixExp.push(operatorStack.pop()!);
        }
        operatorStack.push(atom);
      }
    }
  }

  // 遍历完中缀表达式后，将操作符栈中的所有元素弹出并加入到后缀表达式栈中
  while (operatorStack.length > 0) {
    postfixExp.push(operatorStack.pop()!);
  }

  // 返回后缀表达式栈
  return postfixExp;
};

export const validateLofiInput = (expression: LofiInputValue) => {
  const expressionInfixValue: IValidateAtom[] = [];
  for (let i = 0; i < expression?.length; ++i) {
    const { value, isText } = expression[i];
    if (isText) {
      // 如果当前元素是个字符
      if (value.match(/[0-9]/)) {
        // 如果当前字符是数字的话，则需要把他和后面的数字拼成一个数字
        let numStr = value;
        let j = i + 1;
        while (
          j < expression?.length &&
          expression[j].isText &&
          expression[j].value.match(/[0-9]/)
        ) {
          numStr += expression[j].value;
          i = j;
          ++j;
        }

        // expressionValue.push(numStr);
        expressionInfixValue.push({
          value: numStr,
          isCalcAtom: true,
        });
      } else {
        // 如果当前字符是运算符或者括号，直接压入栈中
        // expressionValue.push(value);
        expressionInfixValue.push({ value });
      }
    } else {
      // 如果当前字符是可计算的单位，直接压入栈中
      // expressionValue.push(value);
      expressionInfixValue.push({ value, isCalcAtom: true });
    }
  }

  const stack: IValidateAtom[] = [];
  const postfix = infix2Postfix(expressionInfixValue);

  if (!postfix) return false;
  // 中缀表达式转换为逆波兰表达式判断合法性
  for (const atom of postfix) {
    if (atom?.isCalcAtom) {
      stack.push(atom);
    } else {
      if (stack.length < 2) {
        // 四则表达式中都是双目运算符，所以不够两个就肯定不合法
        return false;
      }
      stack.pop();
      stack.pop();
      stack.push({
        value: 'FINAL',
      }); // 压入一个任意字符，表示运算结果
    }
  }

  return stack.length === 1;
};
