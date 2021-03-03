/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-03-03 23:31:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\plugins\error.ts
 */
import AjaxError from '../model/AjaxError';
import CommonError from '../model/CommonError';
import ajax from '../tools/ajax';

type ErrorT = AjaxError | CommonError;

const ERROR_HANDLERS = new Map<Object, any>([
  [AjaxError, (error: AjaxError) => {
    const { stack, message, data, date, url, method, referer, status } = error;
    if (process.env.NODE_ENV === 'production') {
      ajax.post('/ajaxError', { stack, message, url, method, referer, status, date, data })
        .catch((e: any) => console.log(e));
    } else console.log(error);
  }],
  [CommonError, (error: CommonError) => {
    const message = error.message || error;
    const stack = error.stack || error;
    const { date } = error;
    if (process.env.NODE_ENV === 'production') {
      ajax.post('/commonError', { message, stack, date }).catch((e: any) => console.log(e));
    } else console.log(error);
  }],
]);

function handleError(error: ErrorT) {
  const errorType = Reflect.getPrototypeOf(error).constructor;
  const handler = ERROR_HANDLERS.get(errorType);
  handler(error);
}

export default () => {
  console.error = (...errors: Array<ErrorT>) => errors.forEach((error) => handleError(error));
};
