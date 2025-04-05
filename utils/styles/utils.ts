import { CSSProperties } from "react";

export const getCSSNumberProperty = (property: keyof CSSProperties) =>
  Number(
    // SSR Check
    typeof window !== "undefined" ? getComputedStyle(document.body).getPropertyValue(property).replace(/\D+/g, "") : 0
  );

export const getBodyOverflow = () => {
  const scrollablePage = document.getElementById("private-page-wrappe");

  return scrollablePage ? getComputedStyle(scrollablePage).overflow : "";
};

export const setBodyOverflow = (overflow: string) => {
  const scrollablePage = document.getElementById("private-page-wrapper");

  if (scrollablePage) scrollablePage.style.overflow = overflow;
};
