/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-22 09:42:32
 * @LastEditTime: 2021-03-03 23:31:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\model\AjaxError.ts
 */
class AjaxError implements AjaxErrorI {
  message: string;

  name: string;

  stack: string;

  data: any;

  date: number;

  method: string;

  referer: string;

  status: number;

  url: string;

  constructor(message: string, name: string, stack: string, data: any, date: number, method: string, referer: string, status: number, url: string) {
    this.message = message;
    this.name = name;
    this.stack = stack;
    this.data = data;
    this.date = date;
    this.method = method;
    this.referer = referer;
    this.status = status;
    this.url = url;
  }
}

export default AjaxError;
