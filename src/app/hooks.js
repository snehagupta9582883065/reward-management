import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

export const useDebounce = (callback, delay) => {
  let timeoutId = null;

  return useCallback((...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};