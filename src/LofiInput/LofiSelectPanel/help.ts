export const findPreviousOption = (
  optionList: NodeListOf<Element>,
  currentItem: Element,
): Element | null => {
  const list = Array.from(optionList);
  const currentOptionIndex = list.indexOf(currentItem);
  let previousOption = null;

  if (currentOptionIndex > -1 && currentOptionIndex > 0) {
    previousOption = list[currentOptionIndex - 1];
  }
  return previousOption;
};

export const findNextOption = (
  optionList: NodeListOf<Element>,
  currentItem: Element,
): Element | null => {
  const list = Array.from(optionList);
  const currentOptionIndex = list.indexOf(currentItem);
  let nextOption = null;

  if (currentOptionIndex > -1 && currentOptionIndex < list.length - 1) {
    nextOption = list[currentOptionIndex + 1];
  }
  return nextOption;
};
