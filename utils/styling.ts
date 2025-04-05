import { RefObject, CSSProperties } from "react";

const GRADIENT =
  "linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 0.01%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))";

/** Example usage:
 * ```
 * <div style={{ backgroundImage: getBackgroundImgWithGradient(imageUrl) }} />
 * ```
 */
export const getBackgroundImgWithGradient = (url: string) => `${GRADIENT}, url("${url}")`;

/**
 * A function which returns a function that allows you to modify the CSS of the element passed into the first call
 * @param el The HTMLElement whose CSS is to be modified
 */
export const createCSSEditFunc =
  (el: RefObject<HTMLElement>) =>
  (attrib: keyof CSSProperties, value: number | string, unit: string = "px") => {
    // CSSStyleDeclaration has its index type set to number (and not string) - see https://github.com/Microsoft/TypeScript/issues/17827
    el.current!.style[attrib as unknown as number] = value + unit; // eslint-disable-line no-param-reassign
  };

export function classNames(...classes: (Maybe<string> | false)[]) {
  return classes.filter(Boolean).join(" ");
}
