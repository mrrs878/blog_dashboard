/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-04-21 15:16:48
 * @LastEditTime: 2021-04-25 10:35:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/src/tool/error.ts
 */

enum ErrorTypes {
  'PromiseError' = 'PromiseError',
  'AssetsError' = 'AssetsError',
  'JSRuntimeError' = 'JSRuntimeError',
  'AjaxError' = 'AjaxError',
}

let sentryConfig: IExceptionSentryConfig = { url: '' };

function getLastEvent(): undefined|Event {
  let lastEvent;
  ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach((eventType) => document.addEventListener(eventType, (event) => {
    lastEvent = event;
  }, {
    capture: true,
    passive: true,
  }));
  return lastEvent;
}

function getLines(stack: string|undefined) {
  return stack?.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('') || '';
}

function getBaseInfoFromEvent(errorType: ErrorTypes): IBaseErrorInfo {
  return {
    title: document.title.replace(/&/, ''),
    location: document.location.href.replace(/&/, ''),
    kind: 'stability',
    type: 'error',
    errorType,
  };
}

function getSelector(path: Array<EventTarget>) {
  console.log(path);
  return '';
}

function report<T>(info: T) {
  console.log(info);
  const image = new Image();
  image.src = `${sentryConfig.url}?error=${JSON.stringify(info)}`;
}

function catchPromiseError() {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    event.preventDefault();
    let message = '';
    let stack = '';
    const { reason } = event;
    message = reason;
    if (reason instanceof Error) {
      message = reason.message;
      stack = getLines(reason.stack);
    }

    report<IPromiseError>({
      message, stack, ...getBaseInfoFromEvent(ErrorTypes.PromiseError),
    });
  });
}

function catchAssetsError() {
  window.addEventListener('error', (event: ErrorEvent) => {
    const { target } = event;
    const isElementTarget = target instanceof HTMLScriptElement
      || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
    if (!isElementTarget) {
      const {
        message, filename, lineno, colno, error,
      } = event;
      const position = `${lineno}:${colno}`;
      const stack = getLines(error instanceof Error ? error.stack : '');
      const lastEvent = getLastEvent();
      const selector = lastEvent ? getSelector(lastEvent.composedPath()) : '';
      report<IJSRunTimeError>({
        message,
        filename,
        position,
        selector,
        stack,
        ...getBaseInfoFromEvent(ErrorTypes.JSRuntimeError),
      });
    } else {
      let url = '';
      let nodeName = '';
      if (target instanceof HTMLImageElement || target instanceof HTMLScriptElement) {
        url = target.src;
        nodeName = target.nodeName;
      }
      if (target instanceof HTMLLinkElement) {
        url = target.href;
        nodeName = target.nodeName;
      }
      report<IAssetsError>({
        ...getBaseInfoFromEvent(ErrorTypes.AssetsError),
        url,
        nodeName,
        message: event.message,
      });
    }
  });
}

function catchAjaxError() {
  const { protocol } = window.location;
  if (protocol === 'file:') return;
  if (!window.XMLHttpRequest) return;
  const xmlReq = window.XMLHttpRequest;
  const oldSend = xmlReq.prototype.send;
  const oldOpen = xmlReq.prototype.open;
  const oldArgs = { method: '', url: '' };
  function handleEvent(event: any) {
    try {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        const { response, status, statusText } = event.currentTarget;
        const { method, url } = oldArgs;

        console.log(event);

        report<IAjaxError>({
          response: JSON.parse(response),
          status,
          method,
          url,
          message: statusText,
          ...getBaseInfoFromEvent(ErrorTypes.AjaxError),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  xmlReq.prototype.send = function send(...args) {
    this.addEventListener('error', handleEvent);
    this.addEventListener('load', handleEvent);
    this.addEventListener('abort', handleEvent);
    return oldSend.apply(this, args);
  };
  xmlReq.prototype.open = function open(...args: any) {
    const [method, url] = args;
    Object.assign(oldArgs, { method, url });
    oldOpen.apply(this, args);
  };
}

function initExceptionSentry(config: IExceptionSentryConfig) {
  sentryConfig = config;
  catchPromiseError();
  catchAssetsError();
  catchAjaxError();
}

export default initExceptionSentry;
