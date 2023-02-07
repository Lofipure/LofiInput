---
title: Lofi-Input
hero:
  title: Lofi-Input
  description: 支持自定义渲染 mention 标签的 React-Input 组件
---

## 快速上手

#### 基本用法

输入配置好的`mentionList`中指定的字符，插入对应标签，`mentionList`中每一个配置项的`classname`属性可以用于自定义样式。

<code src="../src/demo/base/index.tsx"></code>

#### 定位钉

- 通过`onChange`回调函数可以获取当前的值和每一个最小节点的定位钉，然后使用组件暴露的`focusAt`方法可以定位到**指定节点的后方**。
- 或者通过`onBlur`获取失去焦点时的定位钉，通过主动调用`focueAt`也可以实现定位。

<code src="../src/demo/positionPin/index.tsx"></code>

#### 插入节点和标签

通过指定数据结构，结合已经配置好的`mentionList`，可以使用`insertMentionTag`或`insertTextNode`向组件中添加节点/文本。
<code src="../src/demo/insertNode/index.tsx"></code>

## API

#### 组件 Props

| 属性名        | 类型                                  | 描述                   | 是否必传 |
| ------------- | ------------------------------------- | ---------------------- | -------- |
| mentionList   | `IMentionAtom[]`                      | 自定义渲染规则         | 是       |
| wrapClassname | `string`                              | 包裹元素类名           | 否       |
| classname     | `string`                              | 输入框类名             | 否       |
| placeholder   | `string`                              | 占位符                 | 否       |
| onChange      | `(value: LofiInputValue) => void`     | 输入框内容变化时的回调 | 否       |
| onBlur        | `(positionPin: IPinPosition) => void` | 失焦时的回调           | 否       |

#### 组件方法

| 方法名           | 类型                                   | 描述                            |
| ---------------- | -------------------------------------- | ------------------------------- |
| getValue         | `() => LofiInputValue`                 | 获取当前输入的值                |
| setValue         | `(value: LofiInputValue) => void`      | 设置当前值                      |
| focusAt          | `(positionPin?: IPinPosition) => void` | 为 Input 设置指定位置的焦点     |
| insertMentionTag | `(value: IMentionInsertAtom) => void`  | 在当前焦点位置插入 Mention 标签 |
| insertTextNode   | `(value: string) => void`              | 在当前焦点位置插入文本          |

#### 组件数据结构「LofiInputValue」

```typescript | pure
type LofiInputValue = Array<{
  label: string;
  value: string;
  isText: boolean; // 是不是文本节点
  mention?: string; // 唤起 mentionChar
  positionPin?: IPinPosition; // 定位钉
}>;
```

#### Mention 标签渲染规则「IMentionAtom」

| 属性名                                          | 类型                         | 描述                          | 是否必传 |
| ----------------------------------------------- | ---------------------------- | ----------------------------- | -------- |
| mentionChar                                     | `string`                     | 唤起标签的字符                | 是       |
| mode                                            | `"selectable" \| "editable"` | 标签类型, 可编辑/可选择       | 是       |
| classname                                       | `string`                     | CSS 类名                      | 否       |
| placeholder                                     | `string`                     | 空占位符                      | 否       |
| searchable <Badge>selectable</Badge>            | `boolean`                    | 是否可搜索                    | 否       |
| dataSource <Badge>selectable</Badge>            | `IMentionDataSource[]`       | 下拉列表可选择的选项          | 否       |
| focusedItemClassname <Badge>selectable</Badge>  | `string`                     | 下拉列表选中项的 CSS 类名     | 否       |
| panelWrapClassname <Badge>selectable</Badge>    | `stirng`                     | 下拉列表 CSS 类名             | 否       |
| empty <Badge>selectable</Badge>                 | `ReactNode`                  | 空列表占位符元素              | 否       |
| showMentionCharBefore <Badge>selectable</Badge> | `boolean`                    | 是否在 mention 标签前显示标志 | 否       |

#### Mention 标签下拉数据源「IMentionDataSource」

```typescript | pure
interface IMentionDataSource {
  type: 'select';
  data: IMentionDataSourceAtom[];
}
```

| 属性名   | 类型                       | 描述                                                                | 是否必传 |
| -------- | -------------------------- | ------------------------------------------------------------------- | -------- |
| label    | `string`                   | 名称                                                                | 是       |
| value    | `string \| number`         | 值                                                                  | 是       |
| children | `IMentionDataSourceAtom[]` | 字节点(当 type='cascader'时有效) <Badge type="success">Next</Badge> | 否       |
