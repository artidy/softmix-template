import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Склеивает классы и убирает конфликтующие Tailwind-утилиты (последняя побеждает). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
