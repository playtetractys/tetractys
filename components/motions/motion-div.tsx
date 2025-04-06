import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

const INITIAL_DIRECTION = {
  left: { opacity: 0, x: -20 },
  right: { opacity: 0, x: 20 },
  up: { opacity: 0, y: 20 },
  down: { opacity: 0, y: -20 },
};

const WHILE_IN_VIEW = { opacity: 1, x: 0, y: 0 };
const TRANSITION = { duration: 0.5, ease: "easeInOut" };

export function MotionDiv({
  children,
  className,
  direction,
}: PropsWithChildren<{ className?: string; direction: keyof typeof INITIAL_DIRECTION }>) {
  return (
    <motion.div
      initial={INITIAL_DIRECTION[direction]}
      whileInView={WHILE_IN_VIEW}
      transition={TRANSITION}
      className={className}
    >
      {children}
    </motion.div>
  );
}
