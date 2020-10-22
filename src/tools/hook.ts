/*
 * @Author: your name
 * @Date: 2020-10-22 15:15:58
 * @LastEditTime: 2020-10-22 15:16:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\hook.ts
 */
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

function getWindowSize() {
  const { innerHeight, innerWidth, outerHeight, outerWidth } = window;
  return { innerHeight, innerWidth, outerHeight, outerWidth };
}

function getInternetState() {
  const { onLine } = navigator;
  return onLine ? 'onLine' : 'offLine';
}

export function useDocumentTitle(newTitle: string) {
  useEffect(() => {
    document.title = newTitle;
    return () => {
      document.title = 'hello mrrs';
    };
  });
}

export function useInputValue(initValue: string)
  : [
    string,
    (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void,
    React.Dispatch<React.SetStateAction<string>>
  ] {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  }, []);

  return [value, onChange, setValue];
}

export function useWindowSizeChange() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  const onWindowResize = useCallback(() => {
    setWindowSize(getWindowSize());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onWindowResize]);

  return windowSize;
}

export function useInternetStateChange() {
  const [internetState, setInternetState] = useState(getInternetState());

  const onInternetStateChange = useCallback(() => {
    setInternetState(getInternetState());
  }, []);

  useEffect(() => {
    window.addEventListener('online', onInternetStateChange);
    window.addEventListener('offline', onInternetStateChange);
    return () => {
      window.removeEventListener('online', onInternetStateChange);
      window.removeEventListener('offline', onInternetStateChange);
    };
  }, [onInternetStateChange]);

  return internetState;
}

export function useWindowScroll(onWindowScrroll: (value?: any) => any) {
  useEffect(() => {
    window.addEventListener('scroll', onWindowScrroll);
    return () => {
      window.removeEventListener('scroll', onWindowScrroll);
    };
  }, [onWindowScrroll]);
}