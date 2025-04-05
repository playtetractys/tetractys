export const getFocusableElements = (
  wrappingElement: HTMLElement,
  elementsToFocus: (keyof HTMLElementTagNameMap)[]
) => {
  // This is our custom list of tabbable elements
  const allFocusableEl = [] as Maybe<HTMLElement>[];

  // Add the provided elements and then include everything with a non-negative tab index
  // button:not([tabindex="-1"]):not([disabled])
  const elementsList = elementsToFocus.reduce(
    (string, elementType) => `${string}${elementType}:not([tabindex="-1"]):not([disabled]),`,
    ""
  );
  // button:not([tabindex="-1"]):not([disabled]),[tabindex]:not([tabindex="-1"]):not([disabled])`
  const allFocusableList = wrappingElement.querySelectorAll(
    `${elementsList}[tabindex]:not([tabindex="-1"]):not([disabled])`
  );
  allFocusableList?.forEach((each) => allFocusableEl.push(each as HTMLElement));

  return allFocusableEl;
};
