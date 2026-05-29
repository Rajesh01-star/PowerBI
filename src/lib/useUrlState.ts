"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Read/write a single URL search param without full page reload.
 * Uses shallow routing via router.replace with scroll: false.
 * 
 * @param key - URL param key (e.g. 's' for sort)
 * @param defaultValue - fallback when param is absent
 */
export function useUrlParam(key: string, defaultValue: string = ''): [string, (value: string) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = searchParams?.get(key) ?? defaultValue;

  const setValue = useCallback((newValue: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (newValue === defaultValue || newValue === '') {
      params.delete(key);
    } else {
      params.set(key, newValue);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname, key, defaultValue]);

  return [value, setValue];
}

/**
 * Read/write a comma-separated array URL param.
 * E.g. ?t=Sales,HR → ['Sales', 'HR']
 */
export function useUrlArrayParam(key: string): [string[], (value: string[]) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams?.get(key) ?? '';
  const value = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const setValue = useCallback((newValue: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (newValue.length === 0) {
      params.delete(key);
    } else {
      params.set(key, newValue.join(','));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname, key]);

  return [value, setValue];
}

/**
 * Read/write a numeric URL param (e.g. page number).
 */
export function useUrlNumParam(key: string, defaultValue: number = 1): [number, (value: number) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams?.get(key);
  const value = raw ? parseInt(raw, 10) || defaultValue : defaultValue;

  const setValue = useCallback((newValue: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (newValue === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, String(newValue));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname, key, defaultValue]);

  return [value, setValue];
}
