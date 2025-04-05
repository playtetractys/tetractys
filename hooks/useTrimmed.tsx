import { useEffect, useState } from "react";

const trimText = (text: string) => text.replace(/\W*\s(\S)*$/, "...");
/**
 * Usage:
 * ```
 * const { trimmed } = useTrimmed(message, maxLength, messageWrapperRef);
 * ```
 * @param text The text to trim
 * @param maxLength The maximum length of the container, with a few characters of wiggle room, to initially trim the text for optimization
 * This does not set an ellipsis at a specific length.
 * The length is like a trigger that needs to create a difference between scroll and client heights to call trimText.
 * @param ref The ref of the element which is containing the text, it must be overflowing within an `overflow: hidden` container
 * @return An object containing the trimmed text
 */
export const useTrimmed = (text: string, maxLength: number, ref: React.RefObject<Element>) => {
  const [trimmed, setTrimmed] = useState(text.substring(0, maxLength));

  useEffect(() => {
    setTrimmed(text.substring(0, maxLength));
  }, [text, maxLength]);

  useEffect(() => {
    if (ref.current && ref.current.scrollHeight > ref.current.clientHeight) setTrimmed(trimText(trimmed));
  }, [ref, trimmed]);

  return { trimmed };
};
