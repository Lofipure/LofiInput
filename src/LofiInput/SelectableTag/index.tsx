import classNames from 'classnames';
import React, { FC } from 'react';
import { IMentionAtom } from '../types';
import './index.less';

interface ISelectableTagProps {
  mentionAtom: IMentionAtom;
}

const SelectableTag: FC<ISelectableTagProps> = ({ mentionAtom }) => {
  const { classname } = mentionAtom;
  return (
    <span
      className={classNames('selectable-tag', classname)}
      contentEditable={false}
    >Haha</span>
  );
};

export default SelectableTag;
