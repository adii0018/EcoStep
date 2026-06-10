import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names conditionally, resolving conflicts.
 * @param {...(string|undefined|null|false)} inputs - Class name strings or falsy values
 * @returns {string} A single merged class name string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
