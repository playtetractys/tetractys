/** Type guard for handling mouse/touch events */
export const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent => "touches" in e;
