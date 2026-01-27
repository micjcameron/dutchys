import { HTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  export interface MotionProps extends HTMLMotionProps<'div'> {
    className?: string;
  }

  export interface MotionButtonProps extends HTMLMotionProps<'button'> {
    className?: string;
  }
} 